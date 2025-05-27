#![allow(unsafe_op_in_unsafe_fn)]

pub mod translation;
pub mod new_translation;
pub mod config;

use config::get_model_config;
use translation::model::TranslationModel;
use pyo3::{exceptions::PyRuntimeError, prelude::*};
use std::sync::{Arc, Mutex};
use tokio::runtime::Runtime;

use crate::translation::detect_language::detect_language;

use crate::new_translation::{
    translator::BatchTranslator,
    cache::TranslationCache,
    config::TranslatorConfig,
};

#[pyclass]
struct Translator {
    translator: Arc<Mutex<BatchTranslator>>,
    cache: Arc<TranslationCache>,
    rt: Arc<Runtime>,
}

#[pymethods]
impl Translator {

    #[new]
    #[allow(unsafe_code)]
    fn new(
        model_path: String,
        source_tokenizer_path: String,
        target_tokenizer_path: String,
        config_path: String,
        redis_url: String,
        cache_ttl: u64,
    ) -> PyResult<Self> {
        let rt = Arc::new(Runtime::new().map_err(|e| PyRuntimeError::new_err(e.to_string()))?);
        let config = TranslatorConfig::new(&config_path).map_err(|e| PyRuntimeError::new_err(e.to_string()))?;

        let translator = Arc::new(Mutex::new(
            BatchTranslator::new(
                &config,
                &source_tokenizer_path,
                &target_tokenizer_path,
                &model_path,
            )
            .map_err(|e| PyRuntimeError::new_err(e.to_string()))?
        ));

        let cache = Arc::new(TranslationCache::new(&redis_url, cache_ttl));

        Ok(Self {
            translator,
            cache,
            rt,
        })
    }

    #[allow(unsafe_code)]
    fn translate(
        &self,
        texts: Vec<String>,
        tgt_lang: String,
        max_length: Option<usize>,
    ) -> PyResult<Vec<String>> {
        let translator = self.translator.clone();
        let cache = self.cache.clone();

        self.rt.block_on(async move {
            let mut cached = Vec::with_capacity(texts.len());
            let mut to_translate = Vec::new();
            let mut indices = Vec::new();

            // check cache
            for (i, text) in texts.iter().enumerate() {
                match cache.get_cached(&tgt_lang, text).await {
                    Some(trans) => cached.push((i, trans.clone())),
                    None => {
                        to_translate.push(text.clone());
                        indices.push(i);
                    }
                }
            }

            // translate uncached texts
            let translations = {
                // only borrow as immutable reference
                let mut translator = translator.lock().unwrap(); // lub .await dla tokio::Mutex
                translator
                    .translate_batch(to_translate, &tgt_lang, max_length)
                    .map_err(|e| PyRuntimeError::new_err(e.to_string()))?
            };

            // Update cache
            for (text, trans) in texts.iter().zip(translations.iter()) {
                cache.set_cached(&tgt_lang, text, trans).await;
            }

            // Combine results
            let mut results = vec![String::new(); texts.len()];
            for (idx, trans) in indices.into_iter().zip(translations.into_iter()) {
                results[idx] = trans;
            }
            for (idx, trans) in cached {
                results[idx] = trans;
            }

            Ok(results)
        })
    }
}

#[pyfunction]
#[allow(unsafe_code)]
fn translate(text: &str, src_lang: &str, tgt_lang: &str) -> PyResult<(String, String)> {
    let detected_lang = if src_lang == "any" {
            match detect_language(text) {
                Some(lang) => lang.iso_code_639_1().to_string(),
                None => "None".to_string(),
            }
        } else {
            src_lang.to_string()
        };

    if detected_lang == "None"{
        return Ok(("Could not detect language.".to_string(), "None".to_string()));
    }

    let det_lang = &detected_lang;

    let config = get_model_config(det_lang, &tgt_lang)
        .map_err(|e| PyErr::new::<pyo3::exceptions::PyRuntimeError, _>(e.to_string()))?;

    let mut model = TranslationModel::new(config)
        .map_err(|e| PyErr::new::<pyo3::exceptions::PyRuntimeError, _>(e.to_string()))?;

    let translated_text= model.translate(text)
        .map_err(|e| PyErr::new::<pyo3::exceptions::PyRuntimeError, _>(e.to_string()))?;

    Ok((translated_text, detected_lang))
}

#[pymodule]
fn translation_module(_py: Python, m: &PyModule) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(translate, m)?)?;
    m.add_class::<Translator>()?;
    Ok(())
}