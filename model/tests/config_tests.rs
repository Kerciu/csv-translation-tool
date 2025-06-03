use anyhow::Result;
use translation_module::config::*;

#[test]
fn test_validate_language() {
    assert!(validate_language("en").is_ok());
    assert!(validate_language("xx").is_err());
}

#[test]
fn test_build_model_id() {
    assert_eq!(
        build_model_id("en", "es"),
        "Helsinki-NLP/opus-mt-en-es"
    );

    assert_eq!(
        build_model_id("pl", "en"),
        "Helsinki-NLP/opus-mt-pl-en"
    );

    assert_eq!(
        build_model_id("ja", "ko"),
        "Helsinki-NLP/opus-mt-ja-ko"
    );

    assert_eq!(
        build_model_id("ar", "ru"),
        "Helsinki-NLP/opus-mt-ar-ru"
    );
}

#[test]
fn test_model_config_creation() -> Result<()> {
    let config = get_model_config("en", "es")?;
    assert_eq!(config.model_id, "Helsinki-NLP/opus-mt-en-es");
    assert_eq!(config.src_token, ">>en<<");
    assert_eq!(config.tgt_token, ">>es<<");
    Ok(())
}
