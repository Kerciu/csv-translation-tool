from django.apps import AppConfig


class TranslationAppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "translation_app"

    def ready(self):
        from .rust_loader import get_translator
        translator = get_translator()

        # warmup the translator
        dummy_batch = ["hello"] * 8
        translator.translate(dummy_batch, "es", 1024)
        translator.translate(dummy_batch, "en", 1024)
