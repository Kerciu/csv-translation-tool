import os
from datetime import datetime, timedelta
from pathlib import Path
from unittest.mock import MagicMock, patch

import jwt
from bson import ObjectId
from django.test import TestCase
from dotenv import load_dotenv

from ..models import CustomUser
from ..serializers import (
    GitHubAuthCallbackSerializer,
    GitHubAuthInitSerializer,
    GoogleAuthCallbackSerializer,
    GoogleAuthInitSerializer,
    UserAuthSerializer,
    UserLogInSerializer,
    UserSerializer,
    UserSignUpSerializer,
    ph,
)


class UserSignUpSerializerTest(TestCase):

    def setUp(self):
        self.user = CustomUser.objects.create(
            username="taken",
            email="taken@taken.com",
            password="pass",
            date_joined=datetime.now(),
        )

    def test_valid_registration(self):
        data = {
            "username": "newuser",
            "email": "new@new.com",
            "password": "pass",
        }
        serializer = UserSignUpSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.username, "newuser")
        self.assertEqual(user.email, "new@new.com")

    def test_invalid_email(self):
        data = {
            "username": "newuser",
            "email": "new",
            "password": "pass",
        }
        serializer = UserSignUpSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(str(serializer.errors["email"][0]), "Invalid email")

    def test_email_taken(self):
        data = {
            "username": "newuser",
            "email": "taken@taken.com",
            "password": "pass",
        }
        serializer = UserSignUpSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            str(serializer.errors["email"][0]),
            "custom user with this email already exists.",
        )

    def test_username_taken(self):
        data = {
            "username": "taken",
            "email": "new@new.com",
            "password": "pass",
        }
        serializer = UserSignUpSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            str(serializer.errors["username"][0]),
            "custom user with this username already exists.",
        )


class UserLogInSerializerTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(
            username="user",
            email="user@user.com",
            password=ph.hash("test"),
            date_joined=datetime.now(),
        )

    def test_invalid_user(self):
        data = {
            "email": "doIexist@gmail.com",
            "password": "no",
        }
        serializer = UserLogInSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(str(serializer.errors["user"][0]), "User not found")

    def test_invalid_password(self):
        data = {
            "email": "user@user.com",
            "password": "no",
        }
        serializer = UserLogInSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(str(serializer.errors["password"][0]), "Invalid password")


class UserAuthSerializerTest(TestCase):

    def setUp(self):
        self.user = CustomUser.objects.create(
            username="user",
            email="user@user.com",
            password=ph.hash("test"),
            date_joined=datetime.now(),
        )

    def test_valid_token_authentication(self):
        payload = {
            "id": str(self.user.id),
            "exp": datetime.now() + timedelta(minutes=60),
            "iat": datetime.now(),
        }
        token = jwt.encode(payload, "secret", algorithm="HS256")
        data = {"token": token}
        serializer = UserAuthSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data.email, "user@user.com")
        self.assertEqual(serializer.validated_data.username, "user")

    def test_expired_token(self):
        payload = {
            "id": str(self.user.id),
            "exp": datetime.now() + timedelta(seconds=-1),
            "iat": datetime.now(),
        }
        token = jwt.encode(payload, "secret", algorithm="HS256")
        data = {"token": token}
        serializer = UserAuthSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(str(serializer.errors["token"][0]), "Unauthenticated")

    def test_invalid_user(self):
        non_existent_id = ObjectId()
        payload = {
            "id": str(non_existent_id),
            "exp": datetime.now() + timedelta(minutes=60),
            "iat": datetime.now(),
        }
        token = jwt.encode(payload, "secret", algorithm="HS256")
        data = {"token": token}
        serializer = UserAuthSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(str(serializer.errors["user"][0]), "User not found")


class GoogleAuthInitSerializerTest(TestCase):
    def setUp(self):
        BASE_DIR = Path(__file__).resolve().parent.parent
        load_dotenv(BASE_DIR / ".env")
        self.GOOGLE_CLIENT_ID = os.getenv("SOCIAL_AUTH_GOOGLE_OAUTH2_KEY")

    @patch("auth_app.serializers.OAuth2Session")
    def test_auth_url_generation(self, mock_oauth):
        mock_session = MagicMock()
        mock_session.create_authorization_url.return_value = (
            "https://accounts.google.com/o/oauth2/auth?mock=true",
            "mock_state",
        )
        mock_oauth.return_value = mock_session

        serializer = GoogleAuthInitSerializer()
        result = serializer.create({})

        self.assertEqual(
            result["auth_url"], "https://accounts.google.com/o/oauth2/auth?mock=true"
        )
        self.assertEqual(result["state"], "mock_state")
        mock_oauth.assert_called_once_with(
            self.GOOGLE_CLIENT_ID, scope="openid email profile"
        )


class GoogleAuthCallbackSerializerTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(
            username="userg@user.com", email="user@user.com", date_joined=datetime.now()
        )
        self.user.set_unusable_password()
        self.user.save()

        self.valid_data = {"code": "test_auth_code", "state": "test_state"}
        BASE_DIR = Path(__file__).resolve().parent.parent
        load_dotenv(BASE_DIR / ".env")
        self.GOOGLE_CLIENT_SECRET = os.getenv("SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET")

    @patch("auth_app.serializers.OAuth2Session")
    def test_valid_google_auth_flow(self, mock_oauth):
        mock_session = MagicMock()

        mock_token = {
            "access_token": "mock_access_token",
            "token_type": "Bearer",
            "expires_in": 3600,
        }
        mock_session.fetch_token.return_value = mock_token

        mock_userinfo = {"email": "test@user.com", "name": "Test User"}
        mock_session.get.return_value.json.return_value = mock_userinfo

        mock_oauth.return_value = mock_session

        serializer = GoogleAuthCallbackSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid())

        result = serializer.create(serializer.validated_data)

        self.assertEqual(result["email"], "test@user.com")
        self.assertTrue(result["token"])
        mock_session.fetch_token.assert_called_once_with(
            "https://oauth2.googleapis.com/token",
            code="test_auth_code",
            client_secret=self.GOOGLE_CLIENT_SECRET,
            auth=None,
        )

    @patch("auth_app.serializers.OAuth2Session")
    def test_new_user_creation(self, mock_oauth):
        mock_session = MagicMock()
        mock_session.fetch_token.return_value = {"access_token": "mock"}
        mock_session.get.return_value.json.return_value = {
            "email": "new@user.com",
            "name": "New User",
        }
        mock_oauth.return_value = mock_session

        serializer = GoogleAuthCallbackSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid())

        result = serializer.create(serializer.validated_data)
        self.assertTrue(result["created"])
        self.assertEqual(result["email"], "new@user.com")

    def test_invalid_code(self):
        invalid_data = {"code": "", "state": "test_state"}

        serializer = GoogleAuthCallbackSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("code", serializer.errors)

    def test_missing_state(self):
        invalid_data = {"code": "test_auth_code", "state": ""}

        serializer = GoogleAuthCallbackSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("state", serializer.errors)


class GitHubAuthInitSerializerTest(TestCase):
    def setUp(self):
        BASE_DIR = Path(__file__).resolve().parent.parent
        load_dotenv(BASE_DIR / ".env")
        self.GITHUB_CLIENT_ID = os.getenv("SOCIAL_AUTH_GITHUB_KEY")
        self.GITHUB_REDIRECT_URI = (
            "http://localhost:8000/authentication/github/callback/"
        )

    @patch("auth_app.serializers.OAuth2Session")
    def test_github_auth_url_generation(self, mock_oauth):
        mock_session = MagicMock()
        mock_session.create_authorization_url.return_value = (
            "https://github.com/login/oauth/authorize?mock=true",
            "mock_state",
        )
        mock_oauth.return_value = mock_session

        serializer = GitHubAuthInitSerializer()
        result = serializer.create({})

        self.assertEqual(
            result["auth_url"], "https://github.com/login/oauth/authorize?mock=true"
        )
        self.assertEqual(result["state"], "mock_state")
        mock_oauth.assert_called_once_with(
            self.GITHUB_CLIENT_ID,
            scope="user:email",
            redirect_uri=self.GITHUB_REDIRECT_URI,
        )


class GitHubAuthCallbackSerializerTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(
            username="githubuser", email="github@user.com", date_joined=datetime.now()
        )
        self.user.set_unusable_password()
        self.user.save()

        self.valid_data = {"code": "test_code", "state": "test_state"}

        BASE_DIR = Path(__file__).resolve().parent.parent
        load_dotenv(BASE_DIR / ".env")
        self.GITHUB_CLIENT_ID = os.getenv("SOCIAL_AUTH_GITHUB_KEY")
        self.GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
        self.GITHUB_REDIRECT_URI = os.getenv("GITHUB_REDIRECT_URI")

    @patch("auth_app.serializers.OAuth2Session")
    def test_valid_github_auth_flow(self, mock_oauth):
        mock_session = MagicMock()

        mock_session.fetch_token.return_value = {
            "access_token": "mock_access_token",
            "token_type": "bearer",
            "scope": "user:email",
        }

        mock_session.get.side_effect = [
            MagicMock(json=lambda: {"login": "githubuser", "id": 1}),
            MagicMock(json=lambda: [{"email": "github@user.com", "primary": True}]),
        ]

        mock_oauth.return_value = mock_session

        serializer = GitHubAuthCallbackSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid())
        result = serializer.create(serializer.validated_data)

        self.assertEqual(result["email"], "github@user.com")
        self.assertTrue(result["token"])
        self.assertEqual(result["created"], True)

        mock_session.fetch_token.assert_called_once_with(
            "https://github.com/login/oauth/access_token",
            code="test_code",
            client_secret=self.GITHUB_CLIENT_SECRET,
        )

    @patch("auth_app.serializers.OAuth2Session")
    def test_new_github_user_creation(self, mock_oauth):
        mock_session = MagicMock()
        mock_session.fetch_token.return_value = {"access_token": "mock_access_token"}
        mock_session.get.side_effect = [
            MagicMock(json=lambda: {"login": "newgithubuser", "id": 2}),
            MagicMock(json=lambda: [{"email": "new@github.com", "primary": True}]),
        ]
        mock_oauth.return_value = mock_session

        serializer = GitHubAuthCallbackSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid())
        result = serializer.create(serializer.validated_data)

        self.assertEqual(result["email"], "new@github.com")
        self.assertTrue(result["created"])
        self.assertTrue(result["token"])

    def test_missing_code(self):
        invalid_data = {"code": "", "state": "some_state"}

        serializer = GitHubAuthCallbackSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("code", serializer.errors)

    def test_missing_state(self):
        invalid_data = {"code": "some_code", "state": ""}

        serializer = GitHubAuthCallbackSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("state", serializer.errors)


class UserSerializerTest(TestCase):

    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username="user",
            email="user@user.com",
            password="test123",
            date_joined=datetime.now(),
        )

    def test_valid_user(self):
        user_serializer = UserSerializer(self.user)
        user_data = user_serializer.data
        self.assertEqual(user_data["username"], "user")
        self.assertEqual(user_data["email"], "user@user.com")
