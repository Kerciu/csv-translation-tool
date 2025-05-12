from django.urls import path

from . import views

urlpatterns = [
    path('health', views.health_check, name='health_check'),
    path("log", views.LogInView.as_view(), name="log_in"),
    path("sign", views.SignUpView.as_view(), name="sign_up"),
    path('user', views.UserView.as_view(), name="user"),
    path('logout', views.LogOutView.as_view(), name="log_out"),
]
