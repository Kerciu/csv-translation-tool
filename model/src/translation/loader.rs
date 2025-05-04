use crate::config::ModelConfig;
use super::{tokenizer::*, model::TranslationModel};
use hf_hub::api::sync::Api;
use candle::{Device, DType, Tensor};
use candle_nn::VarBuilder;
use candle_transformers::models::marian::MTModel;
use anyhow::{Result, Error};
use tempfile::TempDir;
use std::process::Command;

fn load_from_candle(api: &Api, model_config: ModelConfig, device: Device, src_lang: &str, tgt_lang: &str) -> Result<TranslationModel> {
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
        }.to_string(),
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
        Tokenizer::from_file(path).map_err(|e| Error::msg(format!("Failed to load tokenizer: {}", e)))?
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
        Tokenizer::from_file(path).map_err(|e| Error::msg(format!("Failed to load decoder tokenizer: {}", e)))?
    };

    let vb = {
        let model_file = model_repo.get("model.safetensors")
            .or_else(|_| model_repo.get("pytorch_model.bin"))?;
        unsafe {
            VarBuilder::from_mmaped_safetensors(&[model_file], DType::F32, &device)?
        }
    };

    let config = model_config.to_marian_config();
    let model = MTModel::new(&config, vb)?;

    Ok(TranslationModel {
        model,
        tokenizer,
        tokenizer_dec,
        config: model_config,
        device,
    })
}

fn convert_and_load(api: &Api, config: ModelConfig, device: Device) -> Result<Self> {
    let temp_dir = TempDir::new()?;
    let output_dir = temp_dir.path();

    let repo = api.repo(Repo::model(config.model_id.clone()));
    repo.get("config.json")?;
    repo.get("pytorch_model.bin")?;

    print!("Config model id: {}", config.model_id);

    let status = Command::new("python")
        .arg("scripts/convert_to_safetensors.py")
        .arg(&config.model_id)
        .arg(output_dir)
        .status()?;

    if !status.success() {
        return Err(Error::msg("Model conversion failed"));
    }

    let vb =  unsafe {
        VarBuilder::from_mmaped_safetensors(
        &[output_dir.join("model.safetensors")],
        DType::F32,
        &device
    )}?;

    let tokenizer = Tokenizer::from_file(output_dir.join("tokenizer.json"))
        .map_err(|e| Error::msg(format!("Tokenizer error: {}", e)))?;

    let model = MTModel::new(&config.to_marian_config(), vb)?;

    Ok(Self {
        model,
        tokenizer,
        tokenizer_dec: tokenizer.clone(),
        config,
        device,
    })
}
