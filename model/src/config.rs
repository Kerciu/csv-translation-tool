use anyhow::{Error, Result};
use candle_nn::Activation;
use candle_transformers::models::marian;
use hf_hub::api::sync::Api;
use serde::Deserialize;
use serde_json;
use std::path::Path;
use std::process::Command;

use crate::translation::language::is_in_translations_map;

#[derive(Debug, Clone)]
pub struct ModelConfig {
    pub model_id: String,
    pub src_token: String,
    pub tgt_token: String,
    pub marian_config: marian::Config,
    pub decoder_start_token_id: u32,
    pub max_position_embeddings: usize,
    pub eos_token_id: u32,
    pub forced_eos_token_id: u32,
    pub pad_token_id: u32,
}

#[derive(Debug, Deserialize)]
struct HuggingFaceConfig {
    vocab_size: usize,
    #[serde(default)]
    decoder_vocab_size: Option<usize>,
    max_position_embeddings: usize,
    encoder_layers: usize,
    encoder_ffn_dim: usize,
    encoder_attention_heads: usize,
    decoder_layers: usize,
    decoder_ffn_dim: usize,
    decoder_attention_heads: usize,
    use_cache: bool,
    is_encoder_decoder: bool,
    activation_function: String,
    d_model: usize,
    decoder_start_token_id: u32,
    #[serde(default = "default_scale_embedding")]
    scale_embedding: bool,
    pad_token_id: u32,
    eos_token_id: u32,
    forced_eos_token_id: u32,
    #[serde(default = "default_share_embeddings")]
    share_encoder_decoder_embeddings: bool,
}

fn default_share_embeddings() -> bool {
    true
}
fn default_scale_embedding() -> bool {
    true
}

impl TryFrom<HuggingFaceConfig> for marian::Config {
    type Error = Error;

    fn try_from(hf: HuggingFaceConfig) -> Result<marian::Config, Error> {
        let decoder_vocab = hf.decoder_vocab_size.unwrap_or_else(|| {
            println!("Using vocab_size as fallback for decoder_vocab_size");
            hf.vocab_size
        });

        Ok(marian::Config {
            vocab_size: hf.vocab_size,
            decoder_vocab_size: Some(decoder_vocab),
            max_position_embeddings: hf.max_position_embeddings,
            encoder_layers: hf.encoder_layers,
            encoder_ffn_dim: hf.encoder_ffn_dim,
            encoder_attention_heads: hf.encoder_attention_heads,
            decoder_layers: hf.decoder_layers,
            decoder_ffn_dim: hf.decoder_ffn_dim,
            decoder_attention_heads: hf.decoder_attention_heads,
            use_cache: hf.use_cache,
            is_encoder_decoder: hf.is_encoder_decoder,
            activation_function: activation_from_str(&hf.activation_function)
                .unwrap_or(Activation::Swish),
            d_model: hf.d_model,
            decoder_start_token_id: hf.decoder_start_token_id,
            scale_embedding: hf.scale_embedding,
            pad_token_id: hf.pad_token_id,
            eos_token_id: hf.eos_token_id,
            forced_eos_token_id: hf.forced_eos_token_id,
            share_encoder_decoder_embeddings: hf.share_encoder_decoder_embeddings,
        })
    }
}

fn activation_from_str(s: &str) -> Result<Activation> {
    match s.to_lowercase().as_str() {
        "swish" => Ok(Activation::Swish),
        "gelu" => Ok(Activation::Gelu),
        "relu" => Ok(Activation::Relu),
        "sigmoid" => Ok(Activation::Sigmoid),
        _ => Err(Error::msg(format!(
            "Unsupported activation function: {}",
            s
        ))),
    }
}

impl ModelConfig {
    pub fn to_marian_config(&self) -> candle_transformers::models::marian::Config {
        self.marian_config.clone()
    }
}

impl Default for ModelConfig {
    fn default() -> Self {
        Self {
            model_id: String::new(),
            src_token: String::new(),
            tgt_token: String::new(),
            decoder_start_token_id: 0,
            eos_token_id: 0,
            max_position_embeddings: 512,
            forced_eos_token_id: 0,
            marian_config: marian::Config::opus_mt_en_fr(),
            pad_token_id: 0,
        }
    }
}

const SUPPORTED_LANGUAGES: &[&str] = &[
    "en", "es", "fr", "de", "it", "pt", "ru", "zh", "ja", "ko", "ar",
];

pub fn validate_language(lang: &str) -> Result<()> {
    if !SUPPORTED_LANGUAGES.contains(&lang) {
        return Err(Error::msg(format!("Unsupported language: {}", lang)));
    }
    Ok(())
}

pub fn build_model_id(src_lang: &str, tgt_lang: &str) -> String {
    format!("Helsinki-NLP/opus-mt-{}-{}", src_lang, tgt_lang)
}

pub fn check_model_exists(model_id: &str) -> Result<()> {
    let api = Api::new()?;

    let model = api.model(model_id.to_string());

    match model.get("model.safetensors") {
        Ok(path) => {
            println!("Found safetensors at: {:?}", path);
            return Ok(());
        }
        Err(err) => {
            println!("model.safetensors not found: {}", err);
        }
    }

    let bin_path = match api.model(model_id.to_string()).get("pytorch_model.bin") {
        Ok(path) => path,
        Err(_) => return Err(Error::msg("Neither safetensors nor pytorch model found")),
    };

    let script_path = "scripts/convert-to-safetensors.py";
    let output = Command::new("python")
        .arg(script_path)
        .arg("--src_dir")
        .arg(bin_path.parent().unwrap())
        .arg("--dest_dir")
        .arg(bin_path.parent().unwrap())
        .output()?;

    if !output.status.success() {
        return Err(Error::msg(format!(
            "Conversion failed: {}",
            String::from_utf8_lossy(&output.stderr)
        )));
    }

    Ok(())
}

fn conversion_files_exist(src_lang: &str, tgt_lang: &str) -> Result<bool> {
    let models_dir =
        Path::new("scripts/converted_models").join(format!("{}-{}", src_lang, tgt_lang));

    let config_path = models_dir.join(format!("config-{}-{}.json", src_lang, tgt_lang));
    let model_path = models_dir.join(format!("model-{}-{}.safetensors", src_lang, tgt_lang));
    let src_tokenizer = models_dir.join(format!(
        "tokenizer-marian-base-{}-{}.json",
        src_lang, tgt_lang
    ));
    let tgt_tokenizer = models_dir.join(format!(
        "tokenizer-marian-base-{}-{}.json",
        tgt_lang, src_lang
    ));

    Ok(config_path.exists()
        && model_path.exists()
        && src_tokenizer.exists()
        && tgt_tokenizer.exists())
}

fn construct_model_config_from_json(src_lang: &str, tgt_lang: &str) -> Result<marian::Config> {
    if !conversion_files_exist(src_lang, tgt_lang)? {
        print!(
            "Generating preparation files for {}->{} conversion... ",
            src_lang, tgt_lang
        );
        generate_preparation_files(src_lang, tgt_lang)?;
        println!("Done.");
    }

    let config_path = Path::new("scripts")
        .join("converted_models")
        .join(format!("{}-{}", src_lang, tgt_lang))
        .join(format!("config-{}-{}.json", src_lang, tgt_lang));

    let file = std::fs::File::open(&config_path)?;
    let reader = std::io::BufReader::new(file);
    let hf_config: HuggingFaceConfig = serde_json::from_reader(reader)?;

    Ok(marian::Config {
        vocab_size: hf_config.vocab_size,
        decoder_vocab_size: hf_config.decoder_vocab_size.or(Some(hf_config.vocab_size)),
        max_position_embeddings: hf_config.max_position_embeddings,
        encoder_layers: hf_config.encoder_layers,
        encoder_ffn_dim: hf_config.encoder_ffn_dim,
        encoder_attention_heads: hf_config.encoder_attention_heads,
        decoder_layers: hf_config.decoder_layers,
        decoder_ffn_dim: hf_config.decoder_ffn_dim,
        decoder_attention_heads: hf_config.decoder_attention_heads,
        use_cache: hf_config.use_cache,
        is_encoder_decoder: hf_config.is_encoder_decoder,
        activation_function: activation_from_str(&hf_config.activation_function)?,
        d_model: hf_config.d_model,
        decoder_start_token_id: hf_config.decoder_start_token_id, // Direct from config
        scale_embedding: hf_config.scale_embedding,
        pad_token_id: hf_config.pad_token_id, // Direct from config
        eos_token_id: hf_config.eos_token_id, // Direct from config
        forced_eos_token_id: hf_config.forced_eos_token_id,
        share_encoder_decoder_embeddings: hf_config.share_encoder_decoder_embeddings,
    })
}

fn generate_preparation_files(src_lang: &str, tgt_lang: &str) -> Result<()> {
    let script_path = "scripts/prepare_convertion.py";
    let output = Command::new("python")
        .arg(script_path)
        .arg(src_lang)
        .arg(tgt_lang)
        .output()?;

    if !output.status.success() {
        return Err(Error::msg(format!(
            "Preparation script failed: {}",
            String::from_utf8_lossy(&output.stderr)
        )));
    }
    Ok(())
}

pub fn get_model_config(src_lang: &str, tgt_lang: &str) -> Result<ModelConfig> {
    validate_language(src_lang)?;
    validate_language(tgt_lang)?;

    let model_id = build_model_id(src_lang, tgt_lang);
    // check_model_exists(&model_id)?;

    if !is_in_translations_map(src_lang, tgt_lang) {
        return Err(Error::msg(format!(
            "Translation from {} to {} is not supported",
            src_lang, tgt_lang
        )));
    }

    let marian_config = match model_id.as_str() {
        "Helsinki-NLP/opus-mt-fr-en" => marian::Config::opus_mt_fr_en(),
        "Helsinki-NLP/opus-mt-tc-big-fr-en" => marian::Config::opus_mt_tc_big_fr_en(),
        "Helsinki-NLP/opus-mt-en-zh" => marian::Config::opus_mt_en_zh(),
        "Helsinki-NLP/opus-mt-en-hi" => marian::Config::opus_mt_en_hi(),
        "Helsinki-NLP/opus-mt-en-es" => marian::Config::opus_mt_en_es(),
        "Helsinki-NLP/opus-mt-en-fr" => marian::Config::opus_mt_en_fr(),
        "Helsinki-NLP/opus-mt-en-ru" => marian::Config::opus_mt_en_ru(),
        _ => {
            if !conversion_files_exist(src_lang, tgt_lang)? {
                generate_preparation_files(src_lang, tgt_lang)?;
            }
            construct_model_config_from_json(src_lang, tgt_lang)?
        }
    };

    Ok(ModelConfig {
        model_id,
        src_token: format!(">>{}<<", src_lang),
        tgt_token: format!(">>{}<<", tgt_lang),
        marian_config: marian_config.clone(),
        decoder_start_token_id: marian_config.decoder_start_token_id,
        max_position_embeddings: marian_config.max_position_embeddings,
        eos_token_id: marian_config.eos_token_id,
        forced_eos_token_id: marian_config.forced_eos_token_id,
        pad_token_id: marian_config.pad_token_id,
    })
}
