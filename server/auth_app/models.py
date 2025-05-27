from django.contrib.auth.models import AbstractUser
from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField


class CustomUser(AbstractUser):
    """
    Custom user model extending Django's AbstractUser.

    Fields:
        - username: Unique login name.
        - email: Unique user email.
        - password: Hashed password.
        - date_joined: Timestamp of when user registered.
        - file: Associated file id.
    """

    id = ObjectIdAutoField(primary_key=True)

    username = models.CharField(max_length=100, unique=True)
    email = models.CharField(max_length=200, unique=True)
    password = models.CharField(max_length=200)

    date_joined = models.DateTimeField("join_date")
    file = models.CharField(max_length=100)

    class Meta:
        db_table = "users"
        managed = False

    def __str__(self):
        return self.username
