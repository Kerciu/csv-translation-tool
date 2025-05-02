pub mod config;
pub mod model;

use config::get_model_config;
use model::TranslationModel;
use pyo3::prelude::*;

#[pyfunction]
fn translate(text: &str, src_lang: &str, tgt_lang: &str) -> PyResult<String> {
    let config = get_model_config(&src_lang, &tgt_lang)
        .map_err(|e| PyErr::new::<pyo3::exceptions::PyRuntimeError, _>(e.to_string()))?;

    let model = TranslationModel::new(config)
        .map_err(|e| PyErr::new::<pyo3::exceptions::PyRuntimeError, _>(e.to_string()))?;

    Ok(format!("Translated: {}", text))
}

#[pymodule]
fn translation_module(_py: Python, m: &PyModule) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(translate, m)?)?;
    Ok(())
}