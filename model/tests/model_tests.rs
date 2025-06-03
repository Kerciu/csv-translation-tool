#[cfg(test)]
mod tests {
    use translation_module::{config::get_model_config, translation::TranslationModel};

    #[test]
    fn test_translate_with_candle() {
        let src_lang = "en";
        let tgt_lang = "es";

        let config = get_model_config(src_lang, tgt_lang).expect("Failed to get model config");

        let mut model = TranslationModel::new(config).expect("Failed to create translation model");

        let batch_to_translate = ["Hello World!".to_string()];
        let batch_refs: Vec<&str> = batch_to_translate.iter().map(|s| s.as_str()).collect();
        let translations = model
            .translate_batch_simple(&batch_refs)
            .expect("Translation failed");

        assert!(!translations.is_empty(), "Translation output is empty");
    }
}
