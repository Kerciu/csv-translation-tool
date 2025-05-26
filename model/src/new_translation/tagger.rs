pub fn format_input(text: &str, tgt_lang: &str) -> String {
    format!(">>{}<< {}", tgt_lang, text)
}

pub fn format_batch(texts: &[String], tgt_lang: &str) -> Vec<String> {
    texts.iter()
        .map(|text| format_input(text, tgt_lang))
        .collect::<Vec<_>>()
}
