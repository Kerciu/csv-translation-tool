#[cfg(test)]
mod tests {
    use candle::Device;
    use hf_hub::api::sync::Api;
    use translation_module::config::ModelConfig;
    use translation_module::translation::loader::load_from_candle;

    #[test]
    fn test_language_extraction() {
        let config = ModelConfig {
            src_token: ">>fr<<".to_string(),
            tgt_token: ">>en<<".to_string(),
            ..Default::default()
        };
        
        let src = config.src_token.trim_start_matches(">>").trim_end_matches("<<");
        let tgt = config.tgt_token.trim_start_matches(">>").trim_end_matches("<<");
        
        assert_eq!(src, "fr");
        assert_eq!(tgt, "en");
    }

    #[test]
    fn test_unsupported_language_pair() {
        let config = ModelConfig {
            src_token: ">>xx<<".to_string(),
            tgt_token: ">>yy<<".to_string(),
            ..Default::default()
        };
        
        let result = load_from_candle(&Api::new().unwrap(), config, Device::Cpu);
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("Unsupported"));
    }

    #[test]
    fn test_same_src_tgt_language() {
        let config = ModelConfig {
            src_token: ">>en<<".to_string(),
            tgt_token: ">>en<<".to_string(),
            ..Default::default()
        };
        
        let result = load_from_candle(&Api::new().unwrap(), config, Device::Cpu);
        assert!(result.is_err());  // should fail earlier in validation
    }
}