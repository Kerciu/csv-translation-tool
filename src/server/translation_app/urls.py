from django.urls import path

from . import views

urlpatterns = [
    path("", views.find_language, name="find language"),
    path("", views.translate, name="translate"),
]