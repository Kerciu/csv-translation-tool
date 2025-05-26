pub mod translation;
pub mod new_translation;
pub mod config;
use config::get_model_config;
use translation::model::TranslationModel;
use pyo3::prelude::*;

use crate::translation::detect_language::detect_language;

#[pyfunction]
#[allow(unsafe_code)]
#[allow(unsafe_op_in_unsafe_fn)]
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
    Ok(())
}