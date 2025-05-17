from django.db import models
from django_mongodb_backend.fields import (
    ArrayField,
    EmbeddedModelField,
    ObjectIdAutoField,
)
from django_mongodb_backend.models import EmbeddedModel


class Cell(EmbeddedModel):
    id = ObjectIdAutoField(primary_key=True)
    text = models.CharField(max_length=100)
    row_number = models.IntegerField(default=0)
    is_translated = models.BooleanField(default=False)

    detected_language = models.CharField(max_length=100)

    class Meta:
        db_table = "cells"
        managed = False

    def __str__(self):
        return self.text

    def to_dict(self):
        return {
            "id": self.id,
            "text": self.text,
            "row_number": self.row_number,
            "is_translated": self.is_translated,
            "detected_language": self.detected_language,
        }


class Column(EmbeddedModel):
    id = ObjectIdAutoField(primary_key=True)
    name = models.CharField(max_length=100)
    rows_number = models.IntegerField(default=0)
    column_number = models.IntegerField(default=0)
    cells = ArrayField(EmbeddedModelField(Cell, null=True, blank=True))

    class Meta:
        db_table = "columns"
        managed = False

    def __str__(self):
        return self.name

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "rows_number": self.rows_number,
            "column_number": self.column_number,
            "cells": self.cells,
        }


class File(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    title = models.CharField(max_length=200)
    upload_time = models.DateTimeField("upload_time")

    columns = ArrayField(EmbeddedModelField(Column, null=True, blank=True))
    columns_number = models.IntegerField(default=0)

    class Meta:
        db_table = "files"
        managed = False

    def __str__(self):
        return self.title

    def to_dict(self):
        return {
            "id": str(self.id),
            "title": self.title,
            "upload_time": self.upload_time,
            "columns_number": self.columns_number,
            "columns": (
                [column.to_dict() for column in self.columns] if self.columns else []
            ),
        }

    def update_cell(self, col_num, row_num, update_data):
        columns = list(self.columns)
        cells = list(columns[col_num].cells)
        cells[row_num].update(update_data)
        columns[col_num].cells = cells
        self.columns = [column.to_dict() for column in columns] if columns else []

        self.save()
