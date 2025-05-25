from django.http import JsonResponse
from django.shortcuts import redirect
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


def health_check(request):
    return JsonResponse({"status": "ok"})


class SignUpView(APIView):
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
    def get(self, request):
        serializer = UserAuthSerializer(data={"token": request.COOKIES.get("jwt")})
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data
            return Response({"email": user.email, "name": user.username})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogOutView(APIView):
    def post(self, request):
        response = Response({"message": "success"})
        response.delete_cookie("jwt")
        return response


class GoogleLoginInitView(APIView):
    def get(self, request):
        serializer = GoogleAuthInitSerializer(data={})
        if serializer.is_valid(raise_exception=True):
            data = serializer.save()
            request.session["oauth_state"] = data["state"]
            return Response({"auth_url": data["auth_url"]})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GoogleLoginCallbackView(APIView):
    def get(self, request):
        code = request.GET.get("code")
        state = request.GET.get("state") or request.session.get("oauth_state")

        serializer = GoogleAuthCallbackSerializer(data={"code": code, "state": state})
        if serializer.is_valid(raise_exception=True):
            user_data = serializer.save()
            token = user_data["token"]
            response = redirect("http://localhost:3000/oauth-success")
            response.set_cookie(key="jwt", value=token, httponly=True)
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GithubLoginInitView(APIView):
    def get(self, request):
        serializer = GitHubAuthInitSerializer(data={})
        if serializer.is_valid(raise_exception=True):
            data = serializer.save()
            request.session["oauth_state"] = data["state"]
            return Response({"auth_url": data["auth_url"]})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GithubLoginCallbackView(APIView):
    def get(self, request):
        code = request.GET.get("code")
        state = request.GET.get("state") or request.session.get("oauth_state")

        serializer = GitHubAuthCallbackSerializer(data={"code": code, "state": state})
        if serializer.is_valid(raise_exception=True):
            user_data = serializer.save()
            token = user_data["token"]
            response = redirect("http://localhost:3000/oauth-success")
            response.set_cookie(key="jwt", value=token, httponly=True)
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
