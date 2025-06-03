use super::translation_map::TranslationMap;

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
