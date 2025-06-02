use crate::config::ModelConfig;
use crate::translation::model::TranslationModel;
use anyhow::{Error, Result};
use candle::{DType, Device};
use candle_nn::VarBuilder;
use candle_transformers::models::marian::MTModel;
use hf_hub::{Repo, RepoType, api::sync::Api};
use std::path::Path;
use tokenizers::Tokenizer;

pub fn load_from_candle(
    api: &Api,
    model_config: ModelConfig,
    device: Device,
) -> Result<TranslationModel> {
    let src_lang = model_config
        .src_token
        .trim_start_matches(">>")
        .trim_end_matches("<<");
    let tgt_lang = model_config
        .tgt_token
        .trim_start_matches(">>")
        .trim_end_matches("<<");

    let model_repo = api.repo(Repo::with_revision(
        model_config.model_id.clone(),
        RepoType::Model,
        match (src_lang, tgt_lang) {
            ("fr", "en") => "refs/pr/4",
            ("en", "zh") => "refs/pr/13",
            ("en", "hi") => "refs/pr/3",
            ("en", "es") => "refs/pr/4",
            ("en", "fr") => "refs/pr/9",
            ("en", "ru") => "refs/pr/7",
            _ => "main",
        }
        .to_string(),
    ));

    let tokenizer = {
        let repo = match (src_lang, tgt_lang) {
            ("fr", "en") => "lmz/candle-marian",
            _ => "KeighBee/candle-marian",
        };
        let filename = match (src_lang, tgt_lang) {
            ("fr", "en") => "tokenizer-marian-base-fr.json",
            ("en", "fr") => "tokenizer-marian-base-en-fr-en.json",
            ("en", "zh") => "tokenizer-marian-base-en-zh-en.json",
            ("en", "hi") => "tokenizer-marian-base-en-hi-en.json",
            ("en", "es") => "tokenizer-marian-base-en-es-en.json",
            ("en", "ru") => "tokenizer-marian-base-en-ru-en.json",
            _ => return Err(Error::msg("Unsupported language pair")),
        };
        let path = Api::new()?.model(repo.to_string()).get(filename)?;
        Tokenizer::from_file(path)
            .map_err(|e| Error::msg(format!("Failed to load tokenizer: {}", e)))?
    };

    let tokenizer_dec = {
        let repo = match (src_lang, tgt_lang) {
            ("fr", "en") => "lmz/candle-marian",
            _ => "KeighBee/candle-marian",
        };
        let filename = match (src_lang, tgt_lang) {
            ("fr", "en") => "tokenizer-marian-base-en.json",
            ("en", "fr") => "tokenizer-marian-base-en-fr-fr.json",
            ("en", "zh") => "tokenizer-marian-base-en-zh-zh.json",
            ("en", "hi") => "tokenizer-marian-base-en-hi-hi.json",
            ("en", "es") => "tokenizer-marian-base-en-es-es.json",
            ("en", "ru") => "tokenizer-marian-base-en-ru-ru.json",
            _ => return Err(Error::msg("Unsupported language pair")),
        };
        let path = Api::new()?.model(repo.to_string()).get(filename)?;
        Tokenizer::from_file(path)
            .map_err(|e| Error::msg(format!("Failed to load decoder tokenizer: {}", e)))?
    };

    let vb = {
        let model_file = model_repo
            .get("model.safetensors")
            .or_else(|_| model_repo.get("pytorch_model.bin"))?;
        unsafe { VarBuilder::from_mmaped_safetensors(&[model_file], DType::F32, &device)? }
    };

    let config = model_config.to_marian_config();
    let model = MTModel::new(&config, vb)?;

    Ok(TranslationModel {
        // model: Arc::new(Mutex::new(model)),
        // tokenizer: Arc::new(tokenizer),
        // tokenizer_dec: Arc::new(tokenizer_dec),
        model,
        tokenizer,
        tokenizer_dec,
        config: model_config,
        device,
    })
}

pub fn convert_and_load(model_config: ModelConfig, device: Device) -> Result<TranslationModel> {
    let src_lang = model_config
        .src_token
        .trim_start_matches(">>")
        .trim_end_matches("<<");
    let tgt_lang = model_config
        .tgt_token
        .trim_start_matches(">>")
        .trim_end_matches("<<");

    if src_lang.is_empty() || tgt_lang.is_empty() {
        return Err(Error::msg("Invalid language codes"));
    }

    print!("Converting model from Hugging Face to Candle format...");
    let config = model_config.to_marian_config();

    let models_dir = Path::new("scripts")
        .join("converted_models")
        .join(format!("{}-{}", src_lang, tgt_lang));

    let tokenizer = {
        let path = models_dir.join(format!(
            "tokenizer-marian-base-{}-{}.json",
            src_lang, tgt_lang
        ));
        Tokenizer::from_file(&path).map_err(|e| {
            Error::msg(format!(
                "Failed to load ENCODER tokenizer: {} [{}]",
                e,
                path.display()
            ))
        })?
    };

    let tokenizer_dec = {
        let path = models_dir.join(format!(
            "tokenizer-marian-base-{}-{}.json",
            tgt_lang, src_lang
        ));
        Tokenizer::from_file(&path).map_err(|e| {
            Error::msg(format!(
                "Failed to load DECODER tokenizer: {} [{}]",
                e,
                path.display()
            ))
        })?
    };

    let vb = {
        let model_file = models_dir.join(format!("model-{}-{}.safetensors", src_lang, tgt_lang));
        if !model_file.exists() {
            return Err(Error::msg(format!(
                "Model file not found: {}",
                model_file.display()
            )));
        }
        let model_path_str = model_file
            .to_str()
            .ok_or_else(|| Error::msg("Invalid UTF-8 in model path"))?;
        unsafe { VarBuilder::from_mmaped_safetensors(&[model_path_str], DType::F32, &device)? }
    };

    let model = MTModel::new(&config, vb)?;

    println!("Successfully converted model from Hugging Face to safetensors Candle format.");

    Ok(TranslationModel {
        // model: Arc::new(Mutex::new(model)),
        // tokenizer: Arc::new(tokenizer),
        // tokenizer_dec: Arc::new(tokenizer_dec),
        model,
        tokenizer,
        tokenizer_dec,
        config: model_config,
        device,
    })
}
