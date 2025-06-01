from django.db import models, transaction
from django_mongodb_backend.fields import (
    ArrayField,
    EmbeddedModelField,
    ObjectIdAutoField,
)
from django_mongodb_backend.models import EmbeddedModel


class Cell(EmbeddedModel):
    """Represents a single cell in a column.

    Args:
        id: Primary key.
        text: Current cell content.
        original_text: Original unmodified content.
        row_number: Position of the row in the table.
        is_translated: Whether the cell has been translated.
        detected_language: Language detected from original text.
    """

    id = ObjectIdAutoField(primary_key=True)
    text = models.CharField(max_length=100)
    original_text = models.CharField(max_length=100)
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
            "original_text": self.original_text,
            "row_number": self.row_number,
            "is_translated": self.is_translated,
            "detected_language": self.detected_language,
        }


class Column(EmbeddedModel):
    """Represents a column in a table containing a list of Cell objects.

    Args:
        id: Primary key.
        name: Name of the column.
        rows_number: Total number of rows in the column.
        column_number: Index of the column.
        cells: List of embedded Cell objects.
    """

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
    """Represents an uploaded file with structured tabular content.

    Args:
        id: Primary key.
        title: File name or title.
        upload_time: When the file was uploaded.
        columns: Embedded list of Column objects.
        columns_number : Number of columns in the file.
    """

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

    @classmethod
    @transaction.atomic
    def update_cells(cls, file_id, idx_list, text_list):
        """Atomic transaction updating multiple cells within the file.

        Args:
            file_id: ID of the file to update.
            idx_list: (List[Tuple[int, int]])List with indexes of translated texts
            text_list (List[Tuple[str, str, bool]]):
            Translated text and detected language and status.
        """
        with transaction.atomic():
            file = cls.objects.select_for_update().get(id=file_id)
            columns = list(file.columns)
            for n in range(0, len(idx_list)):
                if text_list[n][2]:
                    update_data = {
                        "text": text_list[n][0],
                        "is_translated": True,
                        "detected_language": text_list[n][1],
                    }
                    cells = list(columns[idx_list[n][0]].cells)
                    cells[idx_list[n][1]].update(update_data)
                    columns[idx_list[n][0]].cells = cells

            file.columns = [column.to_dict() for column in columns]

            file.save()

    @classmethod
    @transaction.atomic
    def revert_cell(cls, file_id, col_num, row_num):
        """Atomic transaction Reverting a specific cell to its original state.

        Args:
            file_id: File ID.
            col_num: Column index.
            row_num: Row index.
        """
        with transaction.atomic():
            file = cls.objects.select_for_update().get(id=file_id)

            columns = list(file.columns)
            cells = list(columns[col_num].cells)
            cell = cells[row_num]
            update_data = {"text": cell["original_text"], "is_translated": False}
            cells[row_num].update(update_data)
            columns[col_num].cells = cells
            file.columns = [column.to_dict() for column in columns]

            file.save()

    @classmethod
    @transaction.atomic
    def delete_file(cls, file_id):
        """Atomic transaction deleting safely a file by ID.

        Args:
            file_id: The ID of the file to delete.
        """
        with transaction.atomic():
            file = cls.objects.filter(id=file_id).first()
            if file is not None:
                file.delete()
