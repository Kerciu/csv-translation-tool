from django.contrib.auth.models import AbstractUser
from django.db import models
from django_mongodb_backend.fields import ArrayField, ObjectIdAutoField


class CustomUser(AbstractUser):
    id = ObjectIdAutoField(primary_key=True)

    username = models.CharField(max_length=100, unique=True)
    email = models.CharField(max_length=200, unique=True)
    password = models.CharField(max_length=200)

    date_joined = models.DateTimeField("join_date")
    files = ArrayField(base_field=models.CharField(max_length=100), default=list)

    class Meta:
        db_table = "users"
        managed = False

    def __str__(self):
        return self.username
