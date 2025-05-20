# tests/test_translation_views.py
import csv
import json
from datetime import datetime
from io import BytesIO, StringIO
from unittest.mock import patch

from auth_app.models import CustomUser
from bson import ObjectId
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from translation_app.models import Cell, Column, File


class BaseSetup:
    def _create_user(self):
        user = CustomUser.objects.create(
            username="tester",
            email="test@test.com",
            password="pass",
            date_joined=datetime.now(),
        )
        return user

    def _jwt_cookie(self, user_id):
        return f"token_{user_id}"


class TranslateCellViewTest(BaseSetup, APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("translate")

        cells = [
            Cell(
                text="Hola", row_number=0, is_translated=False, detected_language="es"
            ).to_dict(),
            Cell(
                text="Mundo", row_number=1, is_translated=False, detected_language="es"
            ).to_dict(),
        ]
        col = Column(
            name="Greeting", column_number=0, rows_number=2, cells=cells
        ).to_dict()
        self.file = File.objects.create(
            title="greet",
            upload_time=datetime.now(),
            columns=[col],
            columns_number=1,
        )
        self.user = self._create_user()
        self.user.files.append(str(self.file.id))

    @patch("translation_app.views.JWTUserAuthentication.get_authenticated_user")
    @patch("translation_app.views.translate_text", return_value="Hello")
    def test_successful_translation(self, mock_translate, mock_auth):
        mock_auth.return_value = self.user
        data = {
            "file_id": str(self.file.id),
            "column_number": 0,
            "row_number": 0,
        }

        resp = self.client.post(self.url, data, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        body = json.loads(resp.content.decode())
        self.assertEqual(body["translated"], "Hello")
        mock_translate.assert_called_once_with("Rust love", "en", "es")


class CSVUploadViewTest(BaseSetup, APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("upload csv")
        self.user = self._create_user()

    @patch("translation_app.views.JWTUserAuthentication.get_authenticated_user")
    def test_valid_csv_upload(self, mock_auth):
        mock_auth.return_value = self.user

        csv_content = "col1;col2\n1;2\n3;4\n"
        tmp = BytesIO(csv_content.encode("utf-8"))
        tmp.name = "data.csv"

        data = {"file": tmp, "title": "sheet"}
        resp = self.client.post(self.url, data, format="multipart")

        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("id", resp.data)
        self.assertTrue(self.user.files)

    def test_reject_non_csv_extension(self):
        tmp = BytesIO(b"text")
        tmp.name = "note.txt"
        data = {"file": tmp}
        resp = self.client.post(self.url, data, format="multipart")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)


class GetUserCSVFilesViewTest(BaseSetup, APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("user csv")
        self.user = self._create_user()

        self.file = File.objects.create(
            title="mine", upload_time=datetime.now(), columns=[], columns_number=0
        )
        self.user.files.append(str(self.file.id))

    @patch("translation_app.views.JWTUserAuthentication.get_authenticated_user")
    def test_returns_only_users_files(self, mock_auth):
        mock_auth.return_value = self.user
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data["files"]), 1)
        self.assertEqual(resp.data["files"][0]["title"], "mine")


class DownloadCSVFileViewTest(BaseSetup, APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("dowloand csv")
        self.user = self._create_user()

        cells = [
            Cell(
                text="a1", row_number=0, is_translated=False, detected_language=""
            ).to_dict(),
            Cell(
                text="a2", row_number=1, is_translated=False, detected_language=""
            ).to_dict(),
        ]
        col = Column(name="A", column_number=0, rows_number=2, cells=cells).to_dict()
        col2 = Column(name="B", column_number=1, rows_number=2, cells=cells).to_dict()
        self.file = File.objects.create(
            title="matrix",
            upload_time=datetime.now(),
            columns=[col, col2],
            columns_number=2,
        )
        self.user.files.append(str(self.file.id))

    @patch("translation_app.views.JWTUserAuthentication.get_authenticated_user")
    def test_downloads_csv_for_owner(self, mock_auth):
        mock_auth.return_value = self.user
        data = {"file_id": self.file.id}
        resp = self.client.get(self.url, data)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp["Content-Type"], "text/csv")
        self.assertIn("attachment; filename=", resp["Content-Disposition"])

        rows = list(csv.reader(StringIO(resp.content.decode()), delimiter=";"))
        self.assertEqual(rows[0], ["A", "B"])
        self.assertEqual(rows[1], ["a1", "a1"])

    @patch("translation_app.views.JWTUserAuthentication.get_authenticated_user")
    def test_forbidden_for_stranger(self, mock_auth):
        mock_auth.return_value = self.user
        data = {"file_id": str(ObjectId())}
        resp = self.client.get(self.url, data)
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
