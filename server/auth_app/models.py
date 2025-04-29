from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField
from django_mongodb_backend.fields import EmbeddedModelField
from django_mongodb_backend.models import EmbeddedModel

# Define your Award class as it is
class Award(EmbeddedModel):
    wins = models.IntegerField(default=0)
    nominations = models.IntegerField(default=0)
    text = models.CharField(max_length=100)

# Modify the Movie model to include ObjectIdAutoField
class Movie(models.Model):
    id = ObjectIdAutoField(primary_key=True)  # Explicitly setting the primary key field
    title = models.CharField(max_length=200)
    plot = models.TextField(blank=True)
    runtime = models.IntegerField(default=0)
    released = models.DateTimeField("release date", null=True, blank=True)
    awards = EmbeddedModelField(Award, null=True, blank=True)

    class Meta:
        db_table = "movies"
        managed = False

    def __str__(self):
        return self.title

# Modify the Viewer model to include ObjectIdAutoField
class Viewer(models.Model):
    id = ObjectIdAutoField(primary_key=True)  # Explicitly setting the primary key field
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=200)

    class Meta:
        db_table = "users"
        managed = False

    def __str__(self):
        return self.name