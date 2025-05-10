from django.http import HttpResponse, JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import UserSignUpSerializer


def health_check(request):
    return JsonResponse({"status": "ok"})


def log_in(request):
    return HttpResponse("Logged in")


@api_view(["POST"])
def sign_up_user(request):
    user_data = request.data
    serializer = UserSignUpSerializer(data=user_data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
