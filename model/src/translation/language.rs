use clap::ValueEnum;

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
