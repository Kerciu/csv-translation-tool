// src/tokenizer.rs
use anyhow::{Result, Error};
use tokenizers::{Tokenizer, AddedToken};
use sentencepiece::SentencePieceProcessor;
use std::collections::HashMap;

pub struct MarianTokenizer {
    source_spm: SentencePieceProcessor,
    target_spm: SentencePieceProcessor,
    lang_tokens: HashMap<String, u32>,
    special_tokens: HashMap<String, u32>,
}

impl MarianTokenizer {
    pub fn from_files(tokenizer_path: &str) -> Result<Self> {
        let config: serde_json::Value = serde_json::from_reader(
            std::fs::File::open(tokenizer_path)?
        )?;

        let source_spm = SentencePieceProcessor::from_proto(
            base64::decode(config["source_spm"].as_str().unwrap())?
        )?;

        let target_spm = SentencePieceProcessor::from_proto(
            base64::decode(config["target_spm"].as_str().unwrap())?
        )?;

        Ok(Self {
            source_spm,
            target_spm,
            lang_tokens: serde_json::from_value(config["lang_tokens"].clone())?,
            special_tokens: serde_json::from_value(config["special_tokens"].clone())?,
        })
    }

    pub fn encode(&self, text: &str, is_source: bool) -> Result<Vec<u32>> {
        let processor = if is_source { &self.source_spm } else { &self.target_spm };
        let pieces = processor.encode(text)
            .map_err(|e| Error::msg(format!("SPM error: {}", e)))?;

        Ok(pieces.into_iter().map(|p| p.id as u32).collect())
    }

    pub fn decode(&self, ids: &[u32], is_source: bool) -> Result<String> {
        let processor = if is_source { &self.source_spm } else { &self.target_spm };
        processor.decode(ids.iter().map(|&id| id as i32))
            .map_err(|e| Error::msg(format!("SPM error: {}", e)))
    }
}
