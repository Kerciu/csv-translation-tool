from django.apps import AppConfig


class AuthAppConfig(AppConfig):
    default_auto_field = "django_mongodb_backend.fields.ObjectIdAutoField"
    name = "auth_app"
