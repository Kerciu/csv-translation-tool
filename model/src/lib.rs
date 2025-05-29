pub mod config;
pub mod translation;
use clap::builder::Str;
use config::get_model_config;
use pyo3::prelude::*;
use translation::model::TranslationModel;


use crate::translation::{
    detect_language::detect_language,
    translator::Translator,
};

#[pyfunction]
#[allow(unsafe_op_in_unsafe_fn)]
fn translate(text: &str, src_lang: &str, tgt_lang: &str) -> PyResult<(String)> {
    let config = get_model_config(src_lang, &tgt_lang)
        .map_err(|e| PyErr::new::<pyo3::exceptions::PyRuntimeError, _>(e.to_string()))?;

    let mut model = TranslationModel::new(config)
        .map_err(|e| PyErr::new::<pyo3::exceptions::PyRuntimeError, _>(e.to_string()))?;

    model
        .translate(text)
        .map_err(|e| PyErr::new::<pyo3::exceptions::PyRuntimeError, _>(e.to_string()))
}

#[pyfunction]
fn detect_lang(text: &str) -> PyResult<(String)> {
    match detect_language(text) {
        Some(lang) => Ok(lang.iso_code_639_1().to_string()),
        None => Ok("None".to_string()),
    }
}

#[pymodule]
fn translation_module(_py: Python, m: &PyModule) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(translate, m)?)?;
    m.add_function(wrap_pyfunction!(detect_lang, m)?)?;
    m.add_class::<Translator>()?;
    Ok(())
}
