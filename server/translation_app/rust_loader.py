from translation_module import Translator
from django.conf import settings
import threading


class TranslatorSingleton:
    _instance = None
    _lock = threading.Lock()

    @classmethod
    def instance(cls):
        with cls._lock:
            if not cls._instance:
                cls._instance = Translator(
                    redis_url = settings.REDIS_URL,
                    cache_ttl = settings.CACHE_TTL,
                )
            
            return cls._instance
        

def get_translator():
    return TranslatorSingleton.instance()
