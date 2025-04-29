use super::config::*;
use anyhow::Result;

#[test]
fn test_validate_language() {
    assert!(validate_language("en").is_ok());
    assert!(validate_language("xx").is_err());
}