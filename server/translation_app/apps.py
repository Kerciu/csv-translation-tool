from django.apps import AppConfig


class TranslationAppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "translation_app"

    def ready(self):
        from .rust_loader import get_translator

        translator = get_translator()

        dummy_batch = ["Hello"] * 8

        # model warmup
        translator.translate_batch(
            dummy_batch,
            "en",
            "de",
        )

        translator.translate_batch(
            dummy_batch,
            "en",
            "es",
        )

