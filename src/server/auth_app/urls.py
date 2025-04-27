from django.urls import path

from . import views

urlpatterns = [
    path("log", views.log_in, name="log_in"),
    path("sign", views.sign_up, name="sign_up"),
    path("test_db_connection", views.sign_up, name="test"),
]