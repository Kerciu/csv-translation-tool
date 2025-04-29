use anyhow::{Result, Error}
use candle_transformers::models::marian::Config;
use hf_hub::{api::sync::Api, Repo};

#[derive(Debug, Clone)]
pub struct ModelConfig {
    pub model_id: String
    pub src_token: String
    pub tgt_token: String
}

const SUPPORTED_LANGUAGES: &[&str] = &["en", "es", "fr", "de", "it", "pt", "ru", "zh", "ja", "ko", "ar"];

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
    let repo = Repo::new(model_id.to_string());
    api.model(repo.id).get("model.safetensors")?;
    Ok(())
}

pub fn get_model_config(src_lang: &str, tgt_lang: &str) -> Result<ModelConfig> {
    validate_language(src_lang)?;
    validate_language(tgt_lang)?;

    let model_id = build_model_id(src_lang, tgt_lang);
    check_model_exists(&model_id)?;

    Ok(ModelConfig {
        model_id,
        src_token: format!(">>{}<<", src_lang),
        tgt_token: format!(">>{}<<", tgt_lang)
    })
}
