fn format_input(text: &str, tgt_lang: &str) -> String {
    format!(">>{}<< {}", tgt_lang, text)
}

fn format_batch(texts: &[&str], tgt_lang: &str) -> Vec<String> {
    texts.iter()
        .map(|text| format_input(text, tgt_lang))
        .collect::<Vec<_>>()
}
