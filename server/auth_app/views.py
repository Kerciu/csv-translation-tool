from django.http import HttpResponse, JsonResponse
from .serializers import UserSignUpSerializer
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

def health_check(request):
    return JsonResponse({"status": "ok"})

def log_in(request):
    return HttpResponse("Logged in")

@api_view(["POST"])
def sign_up_user(request):
    serializer = UserSignUpSerializer(data=request.data)
    if(serializer.is_valid):
        serializer.save()
        return Response(serializer.data)
        
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



