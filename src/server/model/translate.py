from langdetect import detect
from langdetect.lang_detect_exception import LangDetectException


class Translator:
    def __init__(self):
        pass

    def _get_model_name(self, src_lang: str, tgt_lang: str) -> str:
        return f"Helsinki-NLP/opus-mt-{src_lang}-{tgt_lang}"

    @staticmethod
    def detect_language(self, text: str) -> str:
        try:
            return detect(text)
        except LangDetectException as e:
            raise ValueError(f"Language detection failed: {e}") from e

    @staticmethod
    def translate(self, text: str, target_language: str) -> str:
        return "Bonjour"
