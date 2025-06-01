use translation_module::config::get_model_config;
use translation_module::translation::detect_language::{detect_language, map_language_to_code};
use translation_module::translation::model::TranslationModel;

fn main() {
    let batch = vec!["Hello World", "This my first test", "How are you?"];

    let src_lang = map_language_to_code(detect_language(batch[1]).unwrap());
    println!("Detected source language: {}", src_lang);

    let tgt_lang = "it";
    let config = get_model_config(&src_lang, &tgt_lang).unwrap();
    println!("Using model config: {:?}", config);

    let mut model = TranslationModel::new(config).expect("Failed to create TranslationModel");

    let translated_ = model
        .translate_batch_simple(&batch)
        .expect("Translation failed");

    for text in translated_ {
        println!("{}", text);
    }
}
