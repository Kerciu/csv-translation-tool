from translation_module import Translator
from django.conf import settings
import threading


class TranslatorSingleton:
    _instance = None
    _lock = threading.Lock()

    @classmethod
    def instance(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = Translator(
                    model_path=settings.TRANSLATION_MODEL_PATH,
                    source_tokenizer_path=settings.TRANSLATION_SRC_TOKENIZER_PATH,
                    target_tokenizer_path=settings.TRANSLATION_TGT_TOKENIZER_PATH,
                    config_path=settings.TRANSLATION_CONFIG_PATH,
                    redis_url=settings.REDIS_URL,
                    cache_ttl=settings.CACHE_TTL,
                )

            return cls._instance


def get_translator():
    return TranslatorSingleton.instance()
