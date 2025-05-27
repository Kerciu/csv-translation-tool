from translation_module import Translator
from django.conf import settings


class TranslatorSingleton:
    _instance = None
    _lock = None

    @classmethod
    def instance(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instalce = Translator(
                    model_path=settings.TRANSLATION_MODEL_PATH,
                    tokenizer_path=settings.TRANSLATION_TOKENIZER_PATH,
                    config_path=settings.TRANSLATION_CONFIG_PATH,
                    redis_url=settings.REDIS_URL,
                    cache_ttl=settings.CACHE_TTL,
                )

            return cls._instance


def get_translator():
    return TranslatorSingleton.instance()
