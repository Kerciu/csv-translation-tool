from src.server.model.translate import Translator

def test_translator_language_detect():
    translator = Translator()

    text = "Hello, how are you?"
    detected_language = translator.detect_language(text)
    assert detected_language == "en", f"Expected 'en', got '{detected_language}'"

def test_translator_translate():
    translator = Translator()

    text = "Hello, how are you?"
    target_language = "fr"
    translated_text = translator.translate(text, target_language)
    assert translated_text == "Bonjour", f"Expected 'Bonjour', got '{translated_text}'"