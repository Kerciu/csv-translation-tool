import argparse
from typing import Set

from langdetect import detect
from langdetect.lang_detect_exception import LangDetectException
from transformers import MarianMTModel, MarianTokenizer


class Translator:
    def __init__(self):
        self.cached_models: Set[MarianMTModel] = {}

    def _get_model_name(self, src_lang: str, tgt_lang: str) -> str:
        return f"Helsinki-NLP/opus-mt-{src_lang}-{tgt_lang}"

    def _load_model(self, src_lang: str, tgt_lang: str) -> MarianMTModel:
        model_name = self._get_model_name(src_lang, tgt_lang)

        if model_name not in self.cached_models:
            tokenizer = MarianTokenizer.from_pretrained(model_name)
            model = MarianMTModel.from_pretrained(model_name)
            self.cached_models[model_name] = (tokenizer, model)

        return self.cached_models[model_name]

    @staticmethod
    def detect_language(text: str) -> str:
        try:
            return detect(text)
        except LangDetectException as e:
            raise ValueError(f"Language detection failed: {e}") from e

    def translate(self, text: str, target_language: str) -> str:

        src_lang = Translator.detect_language(text)
        if src_lang == target_language:
            return text

        tokenizer, model = self._load_model(src_lang, target_language)
        inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
        translated_text = model.generate(**inputs)

        return tokenizer.decode(translated_text[0], skip_special_tokens=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Translate text using MarianMTModel")
    parser.add_argument("text", type=str, help="Text to translate")
    parser.add_argument(
        "target_language", type=str, help="Target language code (e.g., 'es', 'fr')"
    )

    args = parser.parse_args()

    translator = Translator()
    translated_text = translator.translate(args.text, args.target_language)
    print(translated_text)
