#[cfg(test)]
mod tests {
    use lingua::Language;
    use translation_module::translation::detect_language::{
        detect_language,
        map_language_to_code,
    };

    #[test]
    fn test_map_language_to_code() {
        assert_eq!(map_language_to_code(Language::English), "en");
        assert_eq!(map_language_to_code(Language::French), "fr");
        assert_eq!(map_language_to_code(Language::German), "de");
        assert_eq!(map_language_to_code(Language::Spanish), "es");
        assert_eq!(map_language_to_code(Language::Korean), "ko");
        assert_eq!(map_language_to_code(Language::Japanese), "ja");
        assert_eq!(map_language_to_code(Language::Italian), "it");
        assert_eq!(map_language_to_code(Language::Portuguese), "pt");
        assert_eq!(map_language_to_code(Language::Russian), "ru");
        assert_eq!(map_language_to_code(Language::Chinese), "zh");
        assert_eq!(map_language_to_code(Language::Arabic), "ar");
        assert_eq!(map_language_to_code(Language::Hindi), "hi");
        assert_eq!(map_language_to_code(Language::Indonesian), "id");
        assert_eq!(map_language_to_code(Language::Polish), "pl");
        assert_eq!(map_language_to_code(Language::Dutch), "nl");
        assert_eq!(map_language_to_code(Language::Swedish), "sv");
        assert_eq!(map_language_to_code(Language::Thai), "th");
        assert_eq!(map_language_to_code(Language::Turkish), "tr");
        assert_eq!(map_language_to_code(Language::Vietnamese), "vi");
    }

    #[test]
    fn test_detect_language_common() {
        let test_cases = vec![
            ("Hello, how are you?", Language::English),
            ("Bonjour, comment allez-vous?", Language::French),
            ("Hallo, wie geht es dir?", Language::German),
            ("Hola, ¿cómo estás?", Language::Spanish),
            ("안녕하세요, 어떻게 지내세요?", Language::Korean),
            ("こんにちは、お元気ですか？", Language::Japanese),
            ("Buongiorno, come stai oggi? Tutto bene?", Language::Italian),
            ("Olá, como você está?", Language::Portuguese),
            ("Привет, как дела?", Language::Russian),
            ("你好，你好吗？", Language::Chinese),
            ("مرحبا كيف حالك؟", Language::Arabic),
            ("नमस्ते, आप कैसे हैं?", Language::Hindi),
            ("Halo, apa kabar?", Language::Indonesian),
            ("Cześć, jak się masz?", Language::Polish),
            ("Hallo, hoe gaat het?", Language::Dutch),
            ("Hej, hur mår du?", Language::Swedish),
            ("สวัสดีคุณเป็นอย่างไร?", Language::Thai),
            ("Merhaba, nasılsın?", Language::Turkish),
            ("Xin chào, bạn khỏe không?", Language::Vietnamese),
        ];

        for (text, expected) in test_cases {
            let detected = detect_language(text);
            assert_eq!(
                detected,
                Some(expected),
                "Failed for text: '{}'. Expected: {:?}, Got: {:?}",
                text,
                expected,
                detected
            );
        }
    }

    #[test]
    fn test_detect_language_edge_cases() {
        assert_eq!(detect_language(""), None);
        
        let swahili_text = "Habari yako?";
        let detected = detect_language(&swahili_text);
        assert!(
            detected.is_none() || matches!(detected, Some(Language::Indonesian)),
            "Expected None or unrelated language, got: {:?}",
            detected
        );
        
        assert_eq!(
            detect_language("Hello world and Bonjour"),
            Some(Language::English)
        );
        
        assert_eq!(
            detect_language("Bonjour"),
            Some(Language::French)
        );
        
        assert_eq!(
            detect_language("123"),
            None
        );
    }

    #[test]
    fn test_detection_and_mapping_integration() {
        let text = "Guten Morgen";
        if let Some(lang) = detect_language(text) {
            assert_eq!(map_language_to_code(lang), "de");
        } else {
            panic!("Failed to detect German text");
        }
    }
}