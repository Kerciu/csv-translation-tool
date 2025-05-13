from datetime import datetime, timedelta
from unittest.mock import MagicMock, patch

import jwt
from auth_app.models import CustomUser
from authlib.integrations.base_client.errors import OAuthError
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


class SignUpViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("sign_up")
        self.valid_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123",
        }
        self.invalid_data = {
            "username": "testuser",
            "email": "invalid-email",
            "password": "testpass123",
        }

    @patch("auth_app.serializers.CustomUser.objects.create")
    @patch("auth_app.serializers.ph")
    def test_successful_registration(self, mock_ph, mock_create):
        mock_ph.hash.return_value = "hashed_password"
        mock_user = MagicMock()
        mock_user.id = 1
        mock_create.return_value = mock_user

        response = self.client.post(self.url, self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        mock_ph.hash.assert_called_once_with("testpass123")
        mock_create.assert_called_once()

    def test_invalid_registration_data(self):
        response = self.client.post(self.url, self.invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LogInViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("log_in")
        self.user = CustomUser(
            username="testuser",
            email="test@example.com",
            password="hashed_password",
            date_joined=datetime.now(),
        )
        self.user.id = 1
        self.valid_data = {
            "email": "test@example.com",
            "password": "testpass123",
        }

    @patch("auth_app.serializers.CustomUser.objects.filter")
    @patch("auth_app.serializers.ph")
    def test_successful_login(self, mock_ph, mock_filter):
        mock_ph.verify.return_value = True
        mock_ph.check_needs_rehash.return_value = False
        mock_filter.return_value.first.return_value = self.user

        response = self.client.post(self.url, self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("jwt", response.data)
        self.assertIn("jwt", response.cookies)

    @patch("auth_app.serializers.CustomUser.objects.filter")
    def test_nonexistent_user(self, mock_filter):
        mock_filter.return_value.first.return_value = None
        data = {"email": "nonexistent@example.com", "password": "testpass123"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("user")
        self.user = CustomUser(
            username="testuser",
            email="test@example.com",
            password="testpass123",
            date_joined=datetime.now(),
        )
        self.user.id = 1

        self.payload = {
            "id": str(self.user.id),
            "exp": datetime.now() + timedelta(minutes=60),
            "iat": datetime.now(),
        }
        self.valid_token = jwt.encode(self.payload, "secret", algorithm="HS256")

    @patch("auth_app.serializers.CustomUser.objects.filter")
    def test_authenticated_request(self, mock_filter):
        mock_filter.return_value.first.return_value = self.user
        self.client.cookies.load({"jwt": self.valid_token})
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.user.email)

    def test_unauthenticated_request(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_expired_token(self):
        expired_payload = {
            "id": str(self.user.id),
            "exp": datetime.now() - timedelta(minutes=60),
            "iat": datetime.now() - timedelta(minutes=120),
        }
        expired_token = jwt.encode(expired_payload, "secret", algorithm="HS256")
        self.client.cookies.load({"jwt": expired_token})
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LogOutViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("log_out")

    def test_successful_logout(self):
        self.client.cookies["jwt"] = "testtoken"
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"message": "success"})
        self.assertEqual(response.cookies["jwt"].value, "")


class GoogleLoginInitViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("google-login")

    @patch("auth_app.serializers.OAuth2Session")
    def test_successful_init(self, mock_oauth):
        mock_session = MagicMock()
        url = mock_session.create_authorization_url
        url.return_value = (
            "http://auth.url",
            "state123",
        )
        mock_oauth.return_value = mock_session

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("auth_url", response.data)
        self.assertEqual("state123", self.client.session["oauth_state"])


class GoogleLoginCallbackViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("google-callback")

        session = self.client.session
        session["oauth_state"] = "teststate123"
        session.save()

    @patch("auth_app.serializers.jwt.encode")
    @patch("auth_app.serializers.CustomUser")
    @patch("auth_app.serializers.OAuth2Session")
    def test_successful_callback(self, mock_oauth, mock_user, mock_jwt):
        mock_session = MagicMock()
        mock_session.fetch_token.return_value = {"access_token": "google_token"}
        mock_session.get.return_value.json.return_value = {
            "email": "google@example.com",
            "name": "Google User",
        }
        mock_oauth.return_value = mock_session

        mock_user_instance = MagicMock()
        mock_user_instance.id = 1
        mock_user_instance.email = "google@example.com"
        mock_user.objects.get_or_create.return_value = (mock_user_instance, True)

        mock_jwt.return_value = "jwttoken123"

        response = self.client.get(
            self.url, {"code": "validcode", "state": "teststate123"}
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)
        self.assertIn("jwt", response.cookies)

    def test_invalid_state(self):
        with self.assertRaises(OAuthError):
            self.client.get(self.url, {"code": "validcode", "state": "wrongstate"})

    def test_missing_code(self):
        response = self.client.get(self.url, {"state": "teststate123"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
