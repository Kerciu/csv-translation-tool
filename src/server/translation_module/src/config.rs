use candle_transformers::models::marian::Config;

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
