from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField
from django_mongodb_backend.fields import EmbeddedModelField
from django_mongodb_backend.models import EmbeddedModel
from django.contrib.auth.models import AbstractUser
from translation_app.models import File

class CustomUser(models.Model):
    id = ObjectIdAutoField(primary_key=True)

    username = models.CharField(max_length=100)
    email = models.CharField(max_length=200)
    salt = models.CharField(max_length=100)
    password = models.CharField(max_length=200)

    date_joined = models.DateTimeField("join_date")
    files = EmbeddedModelField(File, null=True, blank=True)


    class Meta:
        db_table = "users"
        managed = False

    def __str__(self):
        return self.name