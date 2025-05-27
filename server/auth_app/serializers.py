import os
from datetime import datetime, timedelta
from pathlib import Path

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerifyMismatchError
from authlib.integrations.requests_client import OAuth2Session
from dotenv import load_dotenv
from rest_framework import serializers

from .models import CustomUser

ph = PasswordHasher()


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for representing a user.

    Fields:
        id: Stringified ObjectId.
        username: Username of the user.
        email: Email of the user.
    """

    id = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ["id", "username", "email"]

    def get_id(self, obj):
        return str(obj.id)


class UserSignUpSerializer(serializers.ModelSerializer):
    """
    Serializer for user sign-up.

    Fields:
        username: Desired username.
        email: User's email address.
        password: User's plain-text password (write-only).
    """

    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ["username", "email", "password"]

    def validate(self, attrs):
        """
        Validates email, and uniqness of it and username
        """
        email = attrs.get("email", "")
        if "@" not in email:
            raise serializers.ValidationError({"email": "Invalid email"})
        if CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError({"emaill": "Email already occupied"})

        username = attrs.get("username", "")
        if CustomUser.objects.filter(username=username).exists():
            raise serializers.ValidationError("Username occupied")

        return attrs

    def create(self, validated_data):
        """
        Creates new user and returns token
        """
        username = validated_data["username"]
        email = validated_data["email"]
        raw_password = validated_data["password"]

        hashed_password = ph.hash(raw_password)

        user = CustomUser.objects.create(
            username=username,
            email=email,
            password=hashed_password,
            date_joined=datetime.now(),
        )
        payload = {
            "id": str(user.id),
            "exp": datetime.now() + timedelta(minutes=60),
            "iat": datetime.now(),
        }

        token = jwt.encode(payload, "secret", algorithm="HS256")

        user.token = token
        return user


class UserLogInSerializer(serializers.Serializer):
    """
    Serializer for user login.

    Fields:
        email: Email address.
        password: Plain-text password.
    """

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        """
        Validates email/password, find user and returns JWT token
        """
        email = attrs.get("email")
        password = attrs.get("password")

        if not email or not password:
            raise serializers.ValidationError("Email and password are required.")

        user = CustomUser.objects.filter(email=email).first()
        if user is None:
            raise serializers.ValidationError({"user": "User not found"})

        try:
            ph.verify(user.password, password)
        except VerifyMismatchError:
            raise serializers.ValidationError({"password": "Invalid password"})
        except InvalidHashError:
            raise serializers.ValidationError({"password": "Invalid password"})

        payload = {
            "id": str(user.id),
            "exp": datetime.now() + timedelta(minutes=60),
            "iat": datetime.now(),
        }
        token = jwt.encode(payload, "secret", algorithm="HS256")

        attrs["token"] = token
        return attrs


class UserAuthSerializer(serializers.Serializer):
    """
    Serializer for verifying JWT tokens for authentication.

    Fields:
        token: JWT token string.
    """

    token = serializers.CharField()

    def validate(self, attrs):
        """
        Validates token
        """
        token = attrs.get("token")

        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise serializers.ValidationError({"token": "Unauthenticated"})

        user = CustomUser.objects.filter(id=payload["id"]).first()
        if not user:
            raise serializers.ValidationError({"user": "User not found"})
        return user


BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")
GOOGLE_CLIENT_ID = os.getenv("SOCIAL_AUTH_GOOGLE_OAUTH2_KEY")
GOOGLE_CLIENT_SECRET = os.getenv("SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET")
REDIRECT_URI = "http://localhost:8000/authentication/google/callback/"


class GoogleAuthInitSerializer(serializers.Serializer):
    """
    Serializer to initiate Google OAuth2 flow.
    """

    def create(self, validated_data):
        """
        Return google authorization url and state
        """
        session = OAuth2Session(GOOGLE_CLIENT_ID, scope="openid email profile")
        uri, state = session.create_authorization_url(
            "https://accounts.google.com/o/oauth2/auth", redirect_uri=REDIRECT_URI
        )
        return {"auth_url": uri, "state": state}


class GoogleAuthCallbackSerializer(serializers.Serializer):
    """
    Serializer to handle the callback from Google OAuth2.

    Fields:
        code: OAuth2 code returned by Google.
        state: State token to prevent CSRF.
    """

    code = serializers.CharField()
    state = serializers.CharField()

    def create(self, validated_data):
        """
        Verifies OAuth2Session and sign up/in user and returns JWT token
        """
        session = OAuth2Session(
            GOOGLE_CLIENT_ID, state=validated_data["state"], redirect_uri=REDIRECT_URI
        )

        session.fetch_token(
            "https://oauth2.googleapis.com/token",
            code=validated_data["code"],
            client_secret=GOOGLE_CLIENT_SECRET,
            auth=None,
        )

        userinfo = session.get("https://www.googleapis.com/oauth2/v1/userinfo").json()

        user, created = CustomUser.objects.get_or_create(
            username=userinfo["email"],
            email=userinfo["email"],
            date_joined=datetime.now(),
        )
        user.set_unusable_password()
        payload = {
            "id": str(user.id),
            "exp": datetime.now() + timedelta(minutes=60),
            "iat": datetime.now(),
        }
        jwttoken = jwt.encode(payload, "secret", algorithm="HS256")

        return {
            "email": user.email,
            "id": str(user.id),
            "token": jwttoken,
            "created": created,
        }


GITHUB_CLIENT_ID = os.getenv("SOCIAL_AUTH_GITHUB_KEY")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
GITHUB_REDIRECT_URI = "http://localhost:8000/authentication/github/callback/"


class GitHubAuthInitSerializer(serializers.Serializer):
    """
    Serializer to initiate Github OAuth2 flow.
    """

    def create(self, validated_data):
        """
        Return github authorization url and state
        """
        session = OAuth2Session(
            GITHUB_CLIENT_ID, scope="user:email", redirect_uri=GITHUB_REDIRECT_URI
        )
        uri, state = session.create_authorization_url(
            "https://github.com/login/oauth/authorize", redirect_uri=GITHUB_REDIRECT_URI
        )
        return {"auth_url": uri, "state": state}


class GitHubAuthCallbackSerializer(serializers.Serializer):
    """
    Serializer to handle the callback from Github OAuth2.

    Fields:
        code: OAuth2 code returned by Github.
        state: State token to prevent CSRF.
    """

    code = serializers.CharField()
    state = serializers.CharField()

    def create(self, validated_data):
        """
        Verifies OAuth2Session and sign up/in user and returns JWT token
        """
        session = OAuth2Session(
            GITHUB_CLIENT_ID,
            state=validated_data["state"],
            redirect_uri=GITHUB_REDIRECT_URI,
        )

        token = session.fetch_token(
            "https://github.com/login/oauth/access_token",
            code=validated_data["code"],
            client_secret=GITHUB_CLIENT_SECRET,
        )

        user_info = session.get("https://api.github.com/user").json()
        emails_info = session.get("https://api.github.com/user/emails").json()
        primary_email = next((e["email"] for e in emails_info if e["primary"]), None)

        user, created = CustomUser.objects.get_or_create(
            username=user_info["login"],
            email=primary_email,
            date_joined=datetime.now(),
        )
        user.set_unusable_password()

        payload = {
            "id": str(user.id),
            "exp": datetime.now() + timedelta(minutes=60),
            "iat": datetime.now(),
        }
        token = jwt.encode(payload, "secret", algorithm="HS256")

        return {
            "email": user.email,
            "id": str(user.id),
            "token": token,
            "created": created,
        }
