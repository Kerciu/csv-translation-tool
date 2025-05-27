use lingua::Language::{
    Arabic, Chinese, English, French, German, Italian, Japanese, Korean, Portuguese, Russian,
    Spanish,
};
use lingua::{Language, LanguageDetector, LanguageDetectorBuilder};

pub fn detect_language(text: &str) -> Option<Language> {
    let languages = vec![
        English, French, German, Spanish, Korean, Japanese, Italian, Portuguese, Russian, Chinese,
        Arabic,
    ];

    let detector: LanguageDetector = LanguageDetectorBuilder::from_languages(&languages).build();

    detector.detect_language_of(text)
}
