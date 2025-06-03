#[cfg(test)]
mod tests {
    use std::fs::{self, File};
    use translation_module::config::*;
    use candle_transformers::models::marian;
    use candle_nn::Activation;
    use std::path::Path;
    use std::env;
    use tempfile::tempdir;

    #[test]
    fn test_validate_language() {
        for lang in SUPPORTED_LANGUAGES {
            assert!(validate_language(lang).is_ok());
        }
        assert!(validate_language("EN").is_err());
        assert!(validate_language("xx").is_err());
        assert!(validate_language("").is_err());
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
    fn test_activation_from_str() {
        assert_eq!(activation_from_str("swish").unwrap(), Activation::Swish);
        assert_eq!(activation_from_str("gelu").unwrap(), Activation::Gelu);
        assert_eq!(activation_from_str("relu").unwrap(), Activation::Relu);
        assert_eq!(activation_from_str("sigmoid").unwrap(), Activation::Sigmoid);
        
        assert!(activation_from_str("invalid").is_err());
        assert!(activation_from_str("").is_err());
    }

    #[test]
    fn test_hf_config_conversion() {
        let hf_config = HuggingFaceConfig {
            vocab_size: 50000,
            decoder_vocab_size: Some(50000),
            max_position_embeddings: 512,
            encoder_layers: 6,
            encoder_ffn_dim: 2048,
            encoder_attention_heads: 8,
            decoder_layers: 6,
            decoder_ffn_dim: 2048,
            decoder_attention_heads: 8,
            use_cache: true,
            is_encoder_decoder: true,
            activation_function: "gelu".to_string(),
            d_model: 512,
            decoder_start_token_id: 0,
            scale_embedding: true,
            pad_token_id: 1,
            eos_token_id: 2,
            forced_eos_token_id: 2,
            share_encoder_decoder_embeddings: true,
        };

        let marian_config: marian::Config = hf_config.try_into().unwrap();
        assert_eq!(marian_config.vocab_size, 50000);
        assert_eq!(marian_config.activation_function, Activation::Gelu);
        assert_eq!(marian_config.eos_token_id, 2);
    }

    #[test]
    fn test_conversion_files_exist() {
        let dir = tempdir().unwrap();
        let path = dir.path().join("scripts/converted_models/en-fr");
        fs::create_dir_all(&path).unwrap();

        File::create(path.join("config-en-fr.json")).unwrap();
        File::create(path.join("model-en-fr.safetensors")).unwrap();
        File::create(path.join("tokenizer-marian-base-en-fr.json")).unwrap();
        File::create(path.join("tokenizer-marian-base-fr-en.json")).unwrap();

        let result = with_mocked_path(dir.path(), || conversion_files_exist("en", "fr"));
        assert!(result.unwrap());
    }

    fn with_mocked_path<F, T>(path: &Path, f: F) -> T
    where
        F: FnOnce() -> T,
    {
        let original_dir = env::current_dir().unwrap();
        let _guard = scopeguard::guard((), |_| env::set_current_dir(&original_dir).unwrap());
        env::set_current_dir(path).unwrap();
        f()
    }

    #[test]
    fn test_get_model_config_known() {
        let config = get_model_config("en", "fr").unwrap();
        assert_eq!(config.model_id, "Helsinki-NLP/opus-mt-en-fr");
        assert_eq!(config.src_token, ">>en<<");
        assert_eq!(config.tgt_token, ">>fr<<");
        assert_eq!(config.marian_config.activation_function, Activation::Swish);
    }

    #[test]
    fn test_unsupported_language() {
        assert!(get_model_config("xx", "en").is_err());
        assert!(get_model_config("en", "xx").is_err());
    }

    #[test]
    fn test_auto_detection() {
        assert!(get_model_config("auto", "en").is_err());   // auto is executed in python module
    }

    #[test]
    fn test_same_src_tgt_language() {
        assert!(get_model_config("en", "en").is_err());
    }

    #[test]
    fn test_invalid_config_json() {
        let dir = tempdir().unwrap();
        let config_path = dir.path().join("config.json");
        fs::write(config_path, "invalid json").unwrap();
        
        let result = construct_model_config_from_json("en", "fr");
        assert!(result.is_err());
    }
}