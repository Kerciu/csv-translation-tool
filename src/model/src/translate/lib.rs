use pyo3::prelude::*;
use pyo3::types::PyString;

#[pyfunction]
fn translate(text: &str, source_lang: &str, target_lang: &str) -> PyResult<String> {
    Ok(format!(
        "[{}->{}] {}",
        source_lang, target_lang, text
    ))
}

#[pymodule]
fn rust_translator(_py: Python, m: &PyModule) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(translate, m)?)?;
    Ok(())
}