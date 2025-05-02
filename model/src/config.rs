use anyhow::{Result, Error};
use hf_hub::api::sync::Api;
use std::process::Command;
use candle_transformers::models::marian;

#[derive(Debug, Clone)]
pub struct ModelConfig {
    pub model_id: String,
    pub src_token: String,
    pub tgt_token: String,
    pub decoder_start_token_id: u32,
    pub max_position_embeddings: usize,
    pub eos_token_id: u32,
    pub forced_eos_token_id: u32,
}

impl ModelConfig {
    pub fn to_marian_config(&self) -> candle_transformers::models::marian::Config {
        match self.model_id.as_str() {
            "Helsinki-NLP/opus-mt-fr-en" => marian::Config::opus_mt_fr_en(),
            "Helsinki-NLP/opus-mt-tc-big-fr-en" => marian::Config::opus_mt_tc_big_fr_en(),
            "Helsinki-NLP/opus-mt-en-zh" => marian::Config::opus_mt_en_zh(),
            "Helsinki-NLP/opus-mt-en-hi" => marian::Config::opus_mt_en_hi(),
            "Helsinki-NLP/opus-mt-en-es" => marian::Config::opus_mt_en_es(),
            "Helsinki-NLP/opus-mt-en-ru" => marian::Config::opus_mt_en_ru(),
            _ => panic!("Unsupported model ID: {}", self.model_id),
        }
    }
}

const SUPPORTED_LANGUAGES: &[&str] = &["en", "es", "fr", "de", "it", "pt", "ru", "zh", "ja", "ko", "ar"];

pub fn validate_language(lang: &str) -> Result<()> {
    if !SUPPORTED_LANGUAGES.contains(&lang) {
        return Err(Error::msg(format!("Unsupported language: {}", lang)));
    }
    Ok(())
}

pub fn build_model_id(src_lang: &str, tgt_lang: &str) -> String {
    format!("Helsinki-NLP/opus-mt-tc-big-{}-{}", src_lang, tgt_lang)
}
pub fn check_model_exists(model_id: &str) -> Result<()> {
    let api = Api::new()?;

    if api.model(model_id.to_string()).get("model.safetensors").is_ok() {
        return Ok(());
    }

    let bin_path = match api.model(model_id.to_string()).get("pytorch_model.bin") {
        Ok(path) => path,
        Err(_) => return Err(Error::msg("Neither safetensors nor pytorch model found")),
    };

    let script_path = "scripts/convert-to-safetensors/convert_to_safetensors.py";
    let output = Command::new("python")
        .arg(script_path)
        .arg("--src-directory")
        .arg(bin_path.parent().unwrap())
        .arg("--dest-directory")
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

pub fn get_model_config(src_lang: &str, tgt_lang: &str) -> Result<ModelConfig> {
    validate_language(src_lang)?;
    validate_language(tgt_lang)?;

    let model_id = build_model_id(src_lang, tgt_lang);
    check_model_exists(&model_id)?;

    let marian_config = match model_id.as_str() {
        "Helsinki-NLP/opus-mt-tc-big-fr-en" => marian::Config::opus_mt_tc_big_fr_en(),
        // Add other model configs here
        _ => return Err(Error::msg("Unsupported model")),
    };

    Ok(ModelConfig {
        model_id,
        src_token: format!(">>{}<<", src_lang),
        tgt_token: format!(">>{}<<", tgt_lang),
        decoder_start_token_id: marian_config.decoder_start_token_id,
        max_position_embeddings: marian_config.max_position_embeddings,
        eos_token_id: marian_config.eos_token_id,
        forced_eos_token_id: marian_config.forced_eos_token_id,
    })
}
