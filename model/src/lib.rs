pub mod config;

use pyo3::prelude::*;

#[pyfunction]
fn translate(text: &str) -> PyResult<String> {
    Ok(format!("Translated: {}", text))
}

#[pymodule]
fn translation_module(_py: Python, m: &PyModule) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(translate, m)?)?;
    Ok(())
}