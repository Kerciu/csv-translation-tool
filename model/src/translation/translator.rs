// src/translation/translator.rs
use crate::config::get_model_config;
use crate::translation::cache::TranslationCache;
use crate::translation::model::TranslationModel;
use pyo3::exceptions::PyRuntimeError;
use pyo3::prelude::*;
use std::sync::Arc;
use tokio::runtime::Runtime;

use crate::translation::detect_language::{detect_language, map_language_to_code};

#[pyclass]
pub struct Translator {
    cache: Arc<TranslationCache>,
    rt: Runtime,
}

impl Translator {
    fn translate_batch_async(
        &self,
        src_lang: &str,
        texts: &[String],
        tgt_lang: &str,
    ) -> PyResult<Vec<String>> {
        self.rt.block_on(async move {
            let mut results = vec![String::new(); texts.len()];
            let mut uncached_indices = Vec::new();
            let mut uncached_texts = Vec::new();

            for (i, text) in texts.iter().enumerate() {

                if let Some(cached) = self.cache.get_cached(src_lang, tgt_lang, text).await {
                    results[i] = cached;
                } else {
                    uncached_indices.push(i);
                    uncached_texts.push(text.as_str());
                }
            }

            if !uncached_texts.is_empty() {
                let config = get_model_config(src_lang, tgt_lang)
                    .map_err(|e| PyRuntimeError::new_err(e.to_string()))?;
                let mut model = TranslationModel::new(config)
                    .map_err(|e| PyRuntimeError::new_err(e.to_string()))?;
                let translations = model
                    .translate_batch_simple(&uncached_texts)
                    .map_err(|e| PyRuntimeError::new_err(e.to_string()))?;

                for (idx, (text, translation)) in uncached_indices
                    .iter()
                    .zip(uncached_texts.iter().zip(translations.iter()))
                {
                    results[*idx] = translation.clone();
                    self.cache
                        .set_cached(src_lang, tgt_lang, text, translation)
                        .await;
                }
            }

            Ok(results)
        })
    }
}

#[pymethods]
impl Translator {
    #[new]
    fn new(redis_url: String, cache_ttl: u64) -> PyResult<Self> {
        let cache = TranslationCache::new(&redis_url, cache_ttl);
        let rt = Runtime::new().map_err(|e| PyRuntimeError::new_err(e.to_string()))?;
        Ok(Self {
            cache: Arc::new(cache),
            rt,
        })
    }

    fn translate_batch(
        &self,
        texts: Vec<String>,
        mut src_lang: String,
        tgt_lang: String,
    ) -> PyResult<Vec<String>> {
        if src_lang == "auto" || src_lang.is_empty() {
            if let Some(first_text) = texts.first() {
                if let Some(detected_lang) = detect_language(first_text) {
                    src_lang = map_language_to_code(detected_lang);
                } else {
                    return Err(PyRuntimeError::new_err("Could not detect source language"));
                }
            } else {
                return Err(PyRuntimeError::new_err("No texts provided for translation"));
            }
        }
        self.translate_batch_async(&src_lang, &texts, &tgt_lang)
    }
}