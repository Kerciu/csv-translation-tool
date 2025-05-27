from django.apps import AppConfig


class TranslationAppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "translation_app"

    def ready(self):
        from .rust_loader import get_translator
        translator = get_translator()

        # warmup the translator
        dummy_batch = ["hello"] * 8
        translator.translate_batch("es", dummy_batch)
        translator.translate_batch("en", dummy_batch)
