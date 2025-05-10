from django.urls import path

from . import views

urlpatterns = [
    path("find_language", views.find_language, name="find language"),
    path("translate", views.translate, name="translate"),
]
