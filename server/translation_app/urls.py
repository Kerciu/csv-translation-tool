from django.urls import path

from . import views

urlpatterns = [
    path("upload_csv", views.CSVUploadView.as_view(), name="upload csv"),
    path("get_user_csv", views.GetUserCSVFiles.as_view(), name="user csv"),
    path("dowloand_csv", views.DowloandCSVFile.as_view(), name="dowloand csv"),
    path("translate_cell", views.TranslateCellView.as_view(), name="translate"),
    path("find_language", views.find_language, name="find language"),
    path("translate", views.translate, name="translate"),
]
