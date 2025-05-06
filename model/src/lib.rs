pub mod translation;
pub mod config;

use config::get_model_config;
use translation::model::TranslationModel;
use pyo3::prelude::*;

#[pyfunction]
#[allow(unsafe_op_in_unsafe_fn)]
fn translate(text: &str, src_lang: &str, tgt_lang: &str) -> PyResult<String> {
    let config = get_model_config(&src_lang, &tgt_lang)
        .map_err(|e| PyErr::new::<pyo3::exceptions::PyRuntimeError, _>(e.to_string()))?;

    let mut model = TranslationModel::new(config)
        .map_err(|e| PyErr::new::<pyo3::exceptions::PyRuntimeError, _>(e.to_string()))?;

    model.translate(text)
        .map_err(|e| PyErr::new::<pyo3::exceptions::PyRuntimeError, _>(e.to_string()))
}


#[pymodule]
fn translation_module(_py: Python, m: &PyModule) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(translate, m)?)?;
    Ok(())
}