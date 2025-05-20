from datetime import datetime

from auth_app.models import CustomUser
from bson import ObjectId
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase

from ..models import Cell, Column, File
from ..serializers import (
    CSVFileSerializer,
    FileUpdateCellSerializer,
    FindCSVFileSerializer,
)


def build_cell(text, row):
    return Cell(
        text=text,
        row_number=row,
        is_translated=False,
        detected_language="en",
    ).to_dict()


def build_column(name, col_num, rows):
    return Column(
        name=name,
        rows_number=len(rows),
        column_number=col_num,
        cells=rows,
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
        title=title,
        upload_time=datetime.utcnow(),
        columns=columns,
        columns_number=cols,
    )


class FileUpdateCellSerializerTest(TestCase):
    def setUp(self):
        self.file = build_file()

    def test_invalid_column_number(self):
        data = {"column_number": 5, "row_number": 1}
        s = FileUpdateCellSerializer(data=data, context={"file": self.file})
        self.assertFalse(s.is_valid())
        self.assertEqual(str(s.errors["file"][0]), "Invalid column number")

    def test_invalid_row_number(self):
        data = {"column_number": 0, "row_number": 10}
        s = FileUpdateCellSerializer(data=data, context={"file": self.file})
        self.assertFalse(s.is_valid())
        self.assertEqual(str(s.errors["file"][0]), "Invalid row number")


class CSVFileSerializerTest(TestCase):
    def test_valid_csv_upload(self):
        csv_content = b"col1,col2\n1,2"
        uploaded = SimpleUploadedFile("data.csv", csv_content, content_type="text/csv")
        data = {"file": uploaded, "title": "My CSV"}
        serializer = CSVFileSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data["file"].name, "data.csv")
        self.assertEqual(serializer.validated_data["title"], "My CSV")

    def test_reject_non_csv_extension(self):
        txt_content = b"hello"
        uploaded = SimpleUploadedFile(
            "note.txt", txt_content, content_type="text/plain"
        )
        data = {"file": uploaded}
        serializer = CSVFileSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            serializer.errors["file"]["file"], "Uploaded file must be a CSV."
        )


class FindCSVFileSerializerTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username="tester",
            email="test@test.com",
            password="secret",
            date_joined=datetime.now(),
        )
        self.file = build_file(title="My")
        self.user.files = [self.file.id]
        self.user.save()

    def test_valid_access(self):
        data = {"file_id": str(self.file.id)}
        serializer = FindCSVFileSerializer(data=data, context={"user": self.user})
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data["file"], self.file)

    def test_file_not_in_user_list(self):
        foreign_file = build_file(title="My not")
        data = {"file_id": str(foreign_file.id)}
        serializer = FindCSVFileSerializer(data=data, context={"user": self.user})
        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            str(serializer.errors["user"][0]), "User doesn't have such a File."
        )

    def test_file_does_not_exist(self):
        non_existent_id = ObjectId()
        data = {"file_id": str(non_existent_id)}

        self.user.files.append(non_existent_id)
        self.user.save()

        serializer = FindCSVFileSerializer(data=data, context={"user": self.user})
        self.assertFalse(serializer.is_valid())
        self.assertEqual(str(serializer.errors["file"][0]), "File doesn't exist.")
