from django.shortcuts import render
from django.http import HttpResponse

def log_in(request):
    return HttpResponse("Logged in")

def sign_up(request):
    return HttpResponse("Signed up")

