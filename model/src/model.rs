struct TranslationModel {

}

impl TranslationModel {
    pub fn new(config: ModelConfig) -> Self {
        TranslationModel {}
    }

    pub fn translate(&self, text: &str) -> String {
        format!("Translated: {}", text)
    }
}