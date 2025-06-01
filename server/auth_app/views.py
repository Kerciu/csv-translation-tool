import os
from pathlib import Path

from django.http import JsonResponse
from django.shortcuts import redirect
from dotenv import load_dotenv
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    GitHubAuthCallbackSerializer,
    GitHubAuthInitSerializer,
    GoogleAuthCallbackSerializer,
    GoogleAuthInitSerializer,
    UserAuthSerializer,
    UserLogInSerializer,
    UserSignUpSerializer,
)


@swagger_auto_schema(
    tags=["Health"], operation_description="Health check endpoint to verify API is up."
)
def health_check(request):
    return JsonResponse({"status": "ok"})


class SignUpView(APIView):
    @swagger_auto_schema(
        request_body=UserSignUpSerializer,
        tags=["Authentication"],
        operation_description="Register a new user and return a JWT token.",
        responses={
            200: openapi.Response(
                description="JWT token response",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={"jwt": openapi.Schema(type=openapi.TYPE_STRING)},
                ),
            ),
            400: "Bad Request",
        },
    )
    def post(self, request):
        user_data = request.data
        serializer = UserSignUpSerializer(data=user_data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            token = getattr(user, "token", None)
            response = Response({"jwt": token})
            response.set_cookie(key="jwt", value=token, httponly=True)
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogInView(APIView):
    @swagger_auto_schema(
        request_body=UserLogInSerializer,
        tags=["Authentication"],
        operation_description="Log in user and return a JWT token.",
        responses={
            200: openapi.Response(
                description="JWT token response",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={"jwt": openapi.Schema(type=openapi.TYPE_STRING)},
                ),
            ),
            400: "Bad Request",
        },
    )
    def post(self, request):
        user_data = request.data
        serializer = UserLogInSerializer(data=user_data)
        if serializer.is_valid(raise_exception=True):
            token = serializer.validated_data["token"]
            response = Response({"jwt": token})
            response.set_cookie(key="jwt", value=token, httponly=True)
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserView(APIView):
    @swagger_auto_schema(
        tags=["Authentication"],
        operation_description="Get user's profile using JWT from cookie.",
        manual_parameters=[
            openapi.Parameter(
                "jwt token",
                openapi.IN_HEADER,
                description="JWT token from cookie",
                type=openapi.TYPE_STRING,
            )
        ],
        responses={
            200: openapi.Response(
                description="User data response",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "email": openapi.Schema(type=openapi.TYPE_STRING),
                        "username": openapi.Schema(type=openapi.TYPE_STRING),
                    },
                ),
            ),
            400: "Bad request",
        },
    )
    def get(self, request):
        serializer = UserAuthSerializer(data={"token": request.COOKIES.get("jwt")})
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data
            return Response({"email": user.email, "name": user.username})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogOutView(APIView):
    @swagger_auto_schema(
        tags=["Authentication"],
        operation_description="Log out user by deleting the JWT cookie.",
        responses={200: "Success"},
    )
    def post(self, request):
        response = Response({"message": "success"}, status=status.HTTP_200_OK)
        response.delete_cookie("jwt")
        return response


class GoogleLoginInitView(APIView):
    @swagger_auto_schema(
        tags=["Authentication: Google"],
        operation_description="Start Google OAuth login and return authorization URL.",
        responses={
            200: openapi.Response(
                description="Google url response",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "url": openapi.Schema(type=openapi.TYPE_STRING),
                        "state": openapi.Schema(type=openapi.TYPE_STRING),
                    },
                ),
            ),
            400: "Bad request",
        },
    )
    def get(self, request):
        serializer = GoogleAuthInitSerializer(data={})
        if serializer.is_valid(raise_exception=True):
            data = serializer.save()
            request.session["oauth_state"] = data["state"]
            return Response({"auth_url": data["auth_url"]})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

CLIENT_REDIRECT_URL = os.getenv("REDIRECT_URL", "http://localhost:3000")


class GoogleLoginCallbackView(APIView):
    @swagger_auto_schema(
        tags=["Authentication: Google"],
        operation_description="Handle Google OAuth callback and set JWT cookie.",
        responses={
            200: openapi.Response(
                description="Jwt token",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "jwt": openapi.Schema(type=openapi.TYPE_STRING),
                    },
                ),
            ),
            400: "Bad request",
        },
    )
    def get(self, request):
        code = request.GET.get("code")
        state = request.GET.get("state") or request.session.get("oauth_state")

        serializer = GoogleAuthCallbackSerializer(data={"code": code, "state": state})
        if serializer.is_valid(raise_exception=True):
            user_data = serializer.save()
            token = user_data["token"]
            response = redirect(f"{CLIENT_REDIRECT_URL}/oauth-success")
            response.set_cookie(key="jwt", value=token, httponly=True)
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GithubLoginInitView(APIView):
    @swagger_auto_schema(
        tags=["Authentication: GitHub"],
        operation_description="Start GitHub OAuth login and return authorization URL.",
        responses={
            200: openapi.Response(
                description="Github url response",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "url": openapi.Schema(type=openapi.TYPE_STRING),
                        "state": openapi.Schema(type=openapi.TYPE_STRING),
                    },
                ),
            ),
            400: "Bad request",
        },
    )
    def get(self, request):
        serializer = GitHubAuthInitSerializer(data={})
        if serializer.is_valid(raise_exception=True):
            data = serializer.save()
            request.session["oauth_state"] = data["state"]
            return Response({"auth_url": data["auth_url"]})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GithubLoginCallbackView(APIView):
    @swagger_auto_schema(
        tags=["Authentication: GitHub"],
        operation_description="Handle GitHub OAuth callback and set JWT cookie.",
        responses={
            200: openapi.Response(
                description="Jwt token",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "jwt": openapi.Schema(type=openapi.TYPE_STRING),
                    },
                ),
            ),
            400: "Bad request",
        },
    )
    def get(self, request):
        code = request.GET.get("code")
        state = request.GET.get("state") or request.session.get("oauth_state")

        serializer = GitHubAuthCallbackSerializer(data={"code": code, "state": state})
        if serializer.is_valid(raise_exception=True):
            user_data = serializer.save()
            token = user_data["token"]
            response = redirect(f"{CLIENT_REDIRECT_URL}/oauth-success")
            response.set_cookie(key="jwt", value=token, httponly=True)
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
