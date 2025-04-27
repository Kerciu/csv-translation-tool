from django.apps import AppConfig
from django_mongodb_backend.fields import ObjectIdAutoField

class AuthAppConfig(AppConfig):
    default_auto_field = 'django_mongodb_backend.fields.ObjectIdAutoField'
    name = 'auth_app'
