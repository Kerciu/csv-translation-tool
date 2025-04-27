from django.shortcuts import render
from django.http import HttpResponse
from .models import Viewer

def log_in(request):
    return HttpResponse("Logged in")

def sign_up(request):
    return HttpResponse("Signed up")

def test_db_connection(request):
    viewers = Viewer.objects.order_by("name")[:10]
    return render(request, "test", {"viewers": viewers})

