from django.db import models
from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField
from django_mongodb_backend.fields import EmbeddedModelField
from django_mongodb_backend.models import EmbeddedModel
from django.contrib.auth.models import AbstractUser


class Cell(EmbeddedModel):
    id = ObjectIdAutoField(primary_key=True)
    text = models.CharField(max_length=100)
    row_number = models.IntegerField(default=0)
    is_translated = models.BooleanField(default=False)
    
    text_translated = models.CharField(max_length=100)
    detected_language = models.CharField(max_length=100)


    class Meta:
        db_table = "cells"
        managed = False

    def __str__(self):
        return self.text

class Column(EmbeddedModel):
    id = ObjectIdAutoField(primary_key=True)
    name = models.CharField(max_length=100)
    rows_number = models.IntegerField(default=0)
    column_number = models.IntegerField(default=0)
    cells = EmbeddedModelField(Cell, null=True, blank=True)

    class Meta:
        db_table = "columns"
        managed = False

    def __str__(self):
        return self.name

class File(EmbeddedModel):
    id = ObjectIdAutoField(primary_key=True)
    title = models.CharField(max_length=200)
    upload_time = models.DateTimeField("upload_time")

    columns = EmbeddedModelField(Column, null=True, blank=True)
    columns_number = models.IntegerField(default=0)


    class Meta:
        db_table = "files"
        managed = False

    def __str__(self):
        return self.title
    
