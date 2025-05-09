from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import Viewer
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({"status": "ok"})

def log_in(request):
    return HttpResponse("Logged in")


def sign_up(request):
    return HttpResponse("Signed up")



