#[cfg(test)]
mod tests {
    use candle::Device;
    use hf_hub::api::sync::Api;
    use std::fs;
    use translation_module::config::ModelConfig;
    use translation_module::translation::loader::{
        load_from_candle, convert_and_load
    };

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
    fn test_invalid_language_codes() {
        let config = ModelConfig {
            src_token: ">> <<".to_string(),
            tgt_token: "invalid".to_string(),
            ..Default::default()
        };
        
        let src = config.src_token.trim_start_matches(">>").trim_end_matches("<<");
        let tgt = config.tgt_token.trim_start_matches(">>").trim_end_matches("<<");
            
        assert!(src.is_empty());
        assert_eq!(tgt, "invalid");  // should still process but fail later
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
    fn test_missing_model_files() {
        let config = ModelConfig {
            src_token: ">>en<<".to_string(),
            tgt_token: ">>fr<<".to_string(),
            model_id: "invalid/model".to_string(),
            ..Default::default()
        };
        
        let result = load_from_candle(&Api::new().unwrap(), config, Device::Cpu);
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("file not found"));
    }

    #[test]
    fn test_conversion_missing_files() {
        let tempdir = tempfile::tempdir().unwrap();
        let model_dir = tempdir.path().join("scripts/converted_models/en-fr");
        fs::create_dir_all(&model_dir).unwrap();
        
        fs::File::create(model_dir.join("tokenizer-marian-base-en-fr.json")).unwrap();
        fs::File::create(model_dir.join("tokenizer-marian-base-fr-en.json")).unwrap();

        let config = ModelConfig {
            src_token: ">>en<<".to_string(),
            tgt_token: ">>fr<<".to_string(),
            ..Default::default()
        };
        
        let result = convert_and_load(config, Device::Cpu);
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("Model file not found"));
    }

    #[test]
    fn test_empty_language_codes() {
        let config = ModelConfig {
            src_token: ">> <<".to_string(),
            tgt_token: ">> <<".to_string(),
            ..Default::default()
        };
        
        let result = convert_and_load(config, Device::Cpu);
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("Invalid language codes"));
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