from datetime import datetime
from unittest.mock import patch

from auth_app.models import CustomUser
from bson import ObjectId
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from translation_app.models import Cell, Column, File
from translation_app.serializers import (
    CSVFileSerializer,
    FileUpdateCellsSerializer,
    FindCSVFileSerializer,
)


def build_cell(text, row):
    return Cell(
        text=text, row_number=row, is_translated=False, detected_language="en"
    ).to_dict()


def build_column(name, col_num, rows):
    return Column(
        name=name, rows_number=len(rows), column_number=col_num, cells=rows
    ).to_dict()


def build_file(title="Test", cols=3, rows_per_col=(2, 5, 1)):
    columns = [
        build_column(
            f"col_{i}",
            i,
            [build_cell(f"cell_{i}_{r}", r) for r in range(rows_per_col[i])],
        )
        for i in range(cols)
    ]
    return File.objects.create(
        title=title, upload_time=datetime.now(), columns=columns, columns_number=cols
    )


class FileUpdateCellsSerializerTest(TestCase):
    def setUp(self):
        self.file = build_file()

    @patch("translation_app.rust_loader.get_translator")
    def test_invalid_column_index(self, mock_get_translator):
        data = {
            "column_idx_list": [5],
            "row_idx_list": [0],
            "target_language": "en",
            "source_language": "de",
        }
        mock_get_translator.return_value.translate_batch.return_value = []

        serializer = FileUpdateCellsSerializer(data=data, context={"file": self.file})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(len(serializer.validated_data["translated_list"]), 0)

    def test_invalid_language_codes(self):
        data = {
            "column_idx_list": [0],
            "row_idx_list": [0],
            "target_language": "invalid",
            "source_language": "de",
        }
        serializer = FileUpdateCellsSerializer(data=data, context={"file": self.file})
        self.assertFalse(serializer.is_valid())
        self.assertIn("Language", serializer.errors)

    @patch("translation_app.rust_loader.get_translator")
    def test_empty_input_lists(self, mock_get_translator):
        data = {
            "column_idx_list": [],
            "row_idx_list": [],
            "target_language": "en",
            "source_language": "de",
        }
        mock_get_translator.return_value.translate_batch.return_value = []

        serializer = FileUpdateCellsSerializer(data=data, context={"file": self.file})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data["translated_list"], [])


class CSVFileSerializerTest(TestCase):
    def test_valid_csv_upload(self):
        csv_content = b"col1;col2\n1;2"
        uploaded = SimpleUploadedFile("data.csv", csv_content, content_type="text/csv")
        serializer = CSVFileSerializer(data={"file": uploaded})
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data["file"].name, "data.csv")

    def test_reject_non_csv(self):
        uploaded = SimpleUploadedFile("note.txt", b"hello", content_type="text/plain")
        serializer = CSVFileSerializer(data={"file": uploaded})
        self.assertFalse(serializer.is_valid())


class FindCSVFileSerializerTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username="tester",
            email="test@test.com",
            password="pass",
            date_joined=datetime.now(),
        )
        self.file = build_file(title="Test File")
        self.user.file = str(self.file.id)
        self.user.save()

    def test_valid_file_access(self):
        serializer = FindCSVFileSerializer(context={"user": self.user})
        validated = serializer.validate({})
        self.assertEqual(validated["file"], self.file)

    def test_file_does_not_exist(self):
        self.user.file = str(ObjectId())
        self.user.save()
        serializer = FindCSVFileSerializer(context={"user": self.user})
        with self.assertRaises(Exception) as context:
            serializer.validate({})
        self.assertIn("File doesn't exist", str(context.exception))

    def test_user_has_no_file(self):
        self.user.file = None
        self.user.save()
        serializer = FindCSVFileSerializer(context={"user": self.user})
        with self.assertRaises(Exception) as context:
            serializer.validate({})
        self.assertIn("User doesn't have any file", str(context.exception))
