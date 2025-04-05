from src.server.model.translate import Translator

translator = Translator()


def test_translator_language_detect_en():
    text = "Hello, how are you?"
    detected_language = translator.detect_language(text)
    assert detected_language == "en", f"Expected 'en', got '{detected_language}'"


def test_translator_language_detect_de():
    text = "Guten tag!"
    detected_language = translator.detect_language(text)
    assert detected_language == "de", f"Expected 'de', got '{detected_language}'"


def test_translator_language_detect_pl():
    text = "Cześć, jak się masz?"
    detected_language = translator.detect_language(text)
    assert detected_language == "pl", f"Expected 'pl', got '{detected_language}'"


def test_translator_translate():
    text = "Hello"
    target_language = "fr"
    translated_text = translator.translate(text, target_language)
    assert translated_text == "Bonjour", f"Expected 'Bonjour', got '{translated_text}'"
