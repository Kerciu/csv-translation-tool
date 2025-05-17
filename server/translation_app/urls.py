from django.urls import path

from . import views

urlpatterns = [
    path("upload_csv", views.CSVUploadView.as_view(), name="upload csv"),
    path("get_user_csv", views.GetUserCSVFiles.as_view(), name="user csv"),
    path("find_language", views.find_language, name="find language"),
    path("translate", views.translate, name="translate"),
]
