from django.http import HttpResponse
from translation_module import translate as r_translate


def find_language(request):
    return HttpResponse("I don't know")


def translate(request):
    return HttpResponse(r_translate("Rust love", "en", "es"))
