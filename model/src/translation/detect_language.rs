pub use lingua::Language::{
    Arabic, Chinese, English, French, German, Italian, Japanese, Korean, Portuguese, Russian,
    Spanish, Hindi, Indonesian, Polish, Dutch, Swedish, Thai, Turkish, Vietnamese
};
use lingua::{Language, LanguageDetector, LanguageDetectorBuilder};

pub fn detect_language(text: &str) -> Option<Language> {
    let languages = vec![
        English, French, German, Spanish, Korean, Japanese, Italian, Portuguese, Russian, Chinese,
        Arabic, Hindi, Indonesian, Polish, Dutch, Swedish, Thai, Turkish, Vietnamese
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
        Hindi => "hi".to_string(),
        Indonesian => "id".to_string(),
        Polish => "pl".to_string(),
        Dutch => "nl".to_string(),
        Swedish => "sv".to_string(),
        Thai => "th".to_string(),
        Turkish => "tr".to_string(),
        Vietnamese => "vi".to_string(),

        _ => "unknown".to_string(),
    }
}
