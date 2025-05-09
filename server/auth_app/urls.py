from django.urls import path

from . import views

urlpatterns = [
    path('health', views.health_check, name='health_check'),
    path("log", views.log_in, name="log_in"),
    path("sign", views.sign_up_user, name="sign_up"),
]
