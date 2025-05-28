pub use lingua::Language::{
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


pub fn map_language_to_code(language: Language) -> String {
    match language {
        English => "en".to_string(),
        French => "fr".to_string(),
        German => "de".to_string(),
        Spanish => "es".to_string(),
        Korean => "ko".to_string(),
        Japanese => "ja".to_string(),
        Italian => "it".to_string(),
        Portuguese => "pt".to_string(),
        Russian => "ru".to_string(),
        Chinese => "zh".to_string(),
        Arabic => "ar".to_string(),
        _ => "unknown".to_string(),
    }
}
