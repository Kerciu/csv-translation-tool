from django.apps import AppConfig

isBusy = False


class TranslationAppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "translation_app"

    isBusy = False

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


def get_is_busy():
    return isBusy


def set_busy(isBusy: bool):
    isBusy = isBusy
