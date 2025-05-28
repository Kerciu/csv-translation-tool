// src/translation/translator.rs
use crate::config::get_model_config;
use crate::translation::cache::TranslationCache;
use crate::translation::model::TranslationModel;
use pyo3::exceptions::PyRuntimeError;
use pyo3::prelude::*;
use std::sync::Arc;
use tokio::runtime::Runtime;

#[pyclass]
pub struct Translator {
    cache: Arc<TranslationCache>,
}

impl Translator {
    fn translate_batch_async(
        &self,
        src_lang: &str,
        texts: &[String],
        tgt_lang: &str,
    ) -> PyResult<Vec<String>> {
        let rt = Runtime::new()?;
        rt.block_on(async move {
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
                    .translate_batch(&uncached_texts)
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
        Ok(Self {
            cache: Arc::new(cache),
        })
    }

    fn translate_batch(
        &self,
        src_lang: String,
        texts: Vec<String>,
        tgt_lang: String,
    ) -> PyResult<Vec<String>> {
        self.translate_batch_async(&src_lang, &texts, &tgt_lang)
    }
}