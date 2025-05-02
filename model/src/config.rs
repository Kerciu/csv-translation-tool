use anyhow::{Result, Error};
use hf_hub::api::sync::Api;
use std::path::PathBuf;
use std::process::Command;

#[derive(Debug, Clone)]
pub struct ModelConfig {
    pub model_id: String,
    pub src_token: String,
    pub tgt_token: String,
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

    Ok(ModelConfig {
        model_id,
        src_token: format!(">>{}<<", src_lang),
        tgt_token: format!(">>{}<<", tgt_lang),
    })
}
