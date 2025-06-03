use serde::Deserialize;
use std::collections::HashMap;
use std::ops::Deref;
use std::path::PathBuf;

#[derive(Debug, Deserialize)]
pub struct TranslationMap(HashMap<String, Vec<String>>);

impl Default for TranslationMap {
    fn default() -> Self {
        Self::new()
    }
}

impl TranslationMap {
    pub fn new() -> Self {
        let json_path = PathBuf::from("scripts")
            .join("data")
            .join("translations_map.json");
        eprintln!("Loading translation map from: {}", json_path.display());

        Self::load_from_json(json_path.to_str().unwrap()).unwrap_or_else(|e| {
            eprintln!(
                "Failed to load translation map, using empty map. Error: {}",
                e
            );
            TranslationMap(HashMap::new())
        })
    }

    fn load_from_json(json_path: &str) -> Result<Self, Box<dyn std::error::Error>> {
        let file = std::fs::File::open(json_path)?;
        let reader = std::io::BufReader::new(file);
        let map: HashMap<String, Vec<String>> = serde_json::from_reader(reader)?;
        Ok(TranslationMap(map))
    }

    pub fn contains_translation(&self, src_lang: &str, tgt_lang: &str) -> bool {
        let normalized_src = src_lang.to_lowercase();
        let normalized_tgt = tgt_lang.to_lowercase();

        self.0
            .get(&normalized_src)
            .is_some_and(|targets| targets.contains(&normalized_tgt))
    }
}

impl Deref for TranslationMap {
    type Target = HashMap<String, Vec<String>>;
    fn deref(&self) -> &Self::Target {
        &self.0
    }
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
