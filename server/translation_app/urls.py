from django.urls import path

from . import views

urlpatterns = [
    path("upload_csv", views.CSVUploadView.as_view(), name="upload csv"),
    path("get_user_csv", views.GetUserCSVFiles.as_view(), name="user csv"),
    path("dowloand_csv", views.DowloandCSVFile.as_view(), name="dowloand csv"),
    path("translate_cells", views.TranslateCellsView.as_view(), name="translate"),
    path("revert_cell", views.RevertCellView.as_view(), name="revert cell"),
]
