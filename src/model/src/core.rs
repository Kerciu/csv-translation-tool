pub fn translate(text: &str, source_lang: &str, target_lang: &str) -> String {
    format!("[{}→{}] {}", source_lang, target_lang, text)
}