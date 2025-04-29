use super::config::*;
use anyhow::Result;

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
}

#[test]
fn test_model_config_creation() -> Result<()> {
    let config = get_model_config("en", "es")?;
    assert_eq!(config.model_id, "Helsinki-NLP/opus-mt-en-es");
    assert_eq!(config.src_token, ">>en<<");
    assert_eq!(config.tgt_token, ">>es<<");
    Ok(())
}

#[test]
fn test_check_model_exists() {
    let result = check_model_exists(build_model_id("en", "es"));
    assert!(result.is_ok(), "Should find existing model");

    let result = check_model_exists(build_model_id("abc", "efg"));
    assert!(result.is_err(), "Should fail as this model does not exist");
}
