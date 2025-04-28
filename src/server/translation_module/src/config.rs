use anyhow::{Result, Error}
use candle_transformers::models::marian::Config;
use hf_hub::{api::sync::Api, Repo};

#derive[(Debug, Clone)]
pub struct ModelConfig {
    pub model_id: String
    pub src_token: String
    pub tgt_token: String
}

const SUPPORTED_LANGUAGES: &[&str] = &["en", "es", "fr", "de", "it", "pt", "ru", "zh", "ja", "ko", "ar"]

pub fn validate_language(lang: &str) -> Result<()> {
    if !SUPPORTED_LANGUAGES.contains(&lang) {
        return Err(Error::msg(format!("Unsupported language: {}", lang)));
    }
    Ok(());
}

pub fn get_model_config(src_lang: &str, tgt_lang: &str) -> Result<ModelConfig> {
    validate_language(&src_lang)?;
    validate_language(&tgt_lang)?;

    let model_repo = Repo::new(format!("Helsinki-NLP/opus-mt-{}-{}", src_lang, tgt_lang));
    let api = Api::new()?;

    if api.model(model_repo.clone().id).get("model.safetensors").is_err() {
        return Err(Error::msg(format!("No model available for {}-{} language pair", src_lang, tgt_lang)));
    }

    Ok(ModelConfig {
        model_repo,
        src_token: format!(">>{}<<", src_lang),
        src_token: format!(">>{}<<", src_lang)
    })
}