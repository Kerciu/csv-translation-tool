from django.shortcuts import render
from django.http import HttpResponse
from translation_module import translate

def find_language(request):
    return HttpResponse("I don't know")

def translate(request):
    return HttpResponse(translate("Rust love"))