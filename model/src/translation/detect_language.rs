use lingua::{Language, LanguageDetector, LanguageDetectorBuilder};
use lingua::Language::{English, French, German, Spanish, Korean, Japanese, Italian, Portuguese, Russian, Chinese, Arabic};

pub fn detect_language(text: &str) -> Option<Language> {
    let languages = vec![
            English,
            French,
            German,
            Spanish,
            Korean,
            Japanese,
            Italian,
            Portuguese,
            Russian,
            Chinese,
            Arabic,
        ];

    let detector: LanguageDetector = LanguageDetectorBuilder::from_languages(&languages).build();

    detector.detect_language_of(text)
}