from django.http import HttpResponse, JsonResponse
from .serializers import UserSignUpSerializer, UserLogInSerializer
from django.http import JsonResponse
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView


def health_check(request):
    return JsonResponse({"status": "ok"})

class SignUpView(APIView):
    def post(self, request):
        user_data = request.data
        serializer = UserSignUpSerializer(data=user_data)
        if(serializer.is_valid(raise_exception=True)):
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogInView(APIView):
    def post(self, request):
        user_data = request.data
        serializer = UserLogInSerializer(data=user_data)
        if(serializer.is_valid(raise_exception=True)):
            token = serializer.validated_data['token']
            response = Response({'jwt': token})
            response.set_cookie(key='jwt', value=token, httponly=True)
            return response
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
