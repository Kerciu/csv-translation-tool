pub mod config;

use config::get_model_config;
use pyo3::prelude::*;

#[pyfunction]
fn translate(text: &str, src_lang: &str, tgt_lang: &str) -> PyResult<String> {
    let config = get_model_config(&src_lang, &tgt_lang)
        .map_err(|e| PyErr::new::<pyo3::exceptions::PyRuntimeError, _>(format!("{}", e)))?;

    Ok(format!("Translated: {}", text))
}

#[pymodule]
fn translation_module(_py: Python, m: &PyModule) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(translate, m)?)?;
    Ok(())
}