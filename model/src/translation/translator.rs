use crate::config::get_model_config;
use crate::translation::cache::TranslationCache;
use crate::translation::model::TranslationModel;
use pyo3::exceptions::PyRuntimeError;
use pyo3::prelude::*;
use std::sync::Arc;
use tokio::runtime::{Handle, Runtime};
use once_cell::sync::Lazy;
use futures_util::future::join_all;

use crate::translation::detect_language::{detect_language, map_language_to_code};
use super::translation_map::TranslationMap;

#[pyclass]
pub struct Translator {
    cache: Arc<TranslationCache>,
    rt_handle: Handle,
    translation_map: Arc<TranslationMap>,
}

impl Translator {
    async fn translate_batch_async_inner(
        &self,
        src_lang: &str,
        texts: &[String],
        tgt_lang: &str,
    ) -> PyResult<Vec<String>> {
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
    }

    async fn translate_single_auto(
        &self,
        text: &str,
        tgt_lang: &str,
    ) -> (String, String, bool) {
        // try to get cached language
        let detected_src_lang = match self.cache.get_cached_language(text).await {
            Some(lang) => lang,
            None => {
                let detected = detect_language(text)
                    .map(map_language_to_code)
                    .unwrap_or_else(|| "auto".to_string());
                if detected != "auto" {
                    self.cache.set_cached_language(text, &detected).await;
                }
                detected
            }
        };

        if detected_src_lang == "auto" {
            return (text.to_string(), "auto".to_string(), false);
        }

        if !self.translation_map.contains_translation(&detected_src_lang, tgt_lang) {
            return (text.to_string(), detected_src_lang, false);
        }

        // translate using batch of one
        match self.translate_batch_async_inner(&detected_src_lang, &[text.to_string()], tgt_lang).await {
            Ok(mut translations) => {
                let translation = translations.pop().unwrap_or_default();
                (translation, detected_src_lang, true)
            }
            Err(_) => (text.to_string(), detected_src_lang, false),
        }
    }
}

#[pymethods]
impl Translator {
    #[new]
    pub fn new(redis_url: String, cache_ttl: u64) -> PyResult<Self> {
        static RUNTIME: Lazy<Runtime> = Lazy::new(|| {
            Runtime::new().expect("Failed to create Tokio runtime")
        });
        
        let cache = Arc::new(TranslationCache::new(&redis_url, cache_ttl));
        let translation_map = Arc::new(TranslationMap::new());
        
        Ok(Self {
            cache,
            rt_handle: RUNTIME.handle().clone(),
            translation_map,
        })
    }

    pub fn translate_batch(
        &self,
        texts: Vec<String>,
        src_lang: String,
        tgt_lang: String,
    ) -> PyResult<Vec<(String, String, bool)>> {
        if src_lang != "auto" && !src_lang.is_empty() {
            // fixed source language
            if !self.translation_map.contains_translation(&src_lang, &tgt_lang) {
                return Ok(texts.into_iter()
                    .map(|_| (String::new(), src_lang.clone(), false))
                    .collect());
            }

            match self.rt_handle.block_on(
                self.translate_batch_async_inner(&src_lang, &texts, &tgt_lang)
            ) {
                Ok(translations) => {
                    let results = translations.into_iter()
                        .map(|t| (t, src_lang.clone(), true))
                        .collect();
                    Ok(results)
                }
                Err(_) => {
                    let results = texts.into_iter()
                        .map(|_| (String::new(), src_lang.clone(), false))
                        .collect();
                    Ok(results)
                }
            }
        } else {
            // auto mode: per-text language detection
            let results = self.rt_handle.block_on(async {
                let futures = texts.iter().map(|text| 
                    self.translate_single_auto(text, &tgt_lang)
                );
                join_all(futures).await
            });
            Ok(results)
        }
    }
}
