pub use lingua::Language::{
    Arabic, Chinese, Dutch, English, French, German, Hindi, Indonesian, Italian, Japanese, Korean,
    Polish, Portuguese, Russian, Spanish, Swedish, Thai, Turkish, Vietnamese,
};
use lingua::{Language, LanguageDetector, LanguageDetectorBuilder};

pub fn detect_language(text: &str) -> Option<Language> {
    if text.trim().len() < 5 {
        return None;
    }

    let languages = vec![
        English, French, German, Spanish, Korean, Japanese, Italian, Portuguese, Russian, Chinese,
        Arabic, Hindi, Indonesian, Polish, Dutch, Swedish, Thai, Turkish, Vietnamese,
    ];

    let detector: LanguageDetector = LanguageDetectorBuilder::from_languages(&languages).build();

    let mut results = detector.compute_language_confidence_values(text);
    results.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());

    let (language, confidence) = results.first()?;

    if *confidence < 0.20 {
        return None;
    }

    Some(*language)
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
    }
}
