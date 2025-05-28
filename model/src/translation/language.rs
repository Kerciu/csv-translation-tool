use clap::ValueEnum;
use super::translation_map::TranslationMap;
use anyhow::Context;

#[derive(Clone, Debug, Copy, PartialEq, Eq, ValueEnum)]
pub enum LanguagePair {
    #[value(name = "fr-en")]
    FrEn,
    #[value(name = "en-zh")]
    EnZh,
    #[value(name = "en-hi")]
    EnHi,
    #[value(name = "en-es")]
    EnEs,
    #[value(name = "en-fr")]
    EnFr,
    #[value(name = "en-ru")]
    EnRu,
}

pub const SUPPORTED_LANGUAGES: &[LanguagePair] = &[
    LanguagePair::FrEn,
    LanguagePair::EnZh,
    LanguagePair::EnHi,
    LanguagePair::EnEs,
    LanguagePair::EnFr,
    LanguagePair::EnRu,
];

#[derive(Clone, Debug, Copy, ValueEnum)]
pub enum Which {
    Base,
    Big,
}

pub fn is_in_translations_map(src_lang: &str, tgt_lang: &str) -> bool {
    let translations_map = TranslationMap::new();

    if translations_map.contains_translation(src_lang, tgt_lang) {
        true
    } else {
        eprintln!(
            "Translation from '{}' to '{}' is not supported.",
            src_lang, tgt_lang
        );
        false
    }
}
