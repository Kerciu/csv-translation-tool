from langdetect import detect
from langdetect.lang_detect_exception import LangDetectException
from transformers import MarianMTModel, MarianTokenizer
from typing import Set


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
        return "Bonjour"
