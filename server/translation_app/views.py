import csv
from datetime import datetime
from io import StringIO, TextIOWrapper
from threading import Thread

from django.http import HttpResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Cell, Column, File
from .serializers import (
    CSVFileSerializer,
    FileUpdateCellsSerializer,
    FindCSVFileSerializer,
)
from .utils import JWTUserAuthentication


def async_update(file_id, column_idx_list, row_idx_list, translated):
    File.update_cells(file_id, column_idx_list, row_idx_list, translated)


def async_revert(file_id, column_idx, row_idx):
    File.revert_cell(file_id, column_idx, row_idx)


class TranslateCellsView(APIView, JWTUserAuthentication):

    def post(self, request):
        user = self.get_authenticated_user(request=request)
        serializer = FindCSVFileSerializer(data=request.data, context={"user": user})
        if not serializer.is_valid(raise_exception=True):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        file = serializer.validated_data["file"]
        update_serializer = FileUpdateCellsSerializer(
            data=request.data, context={"file": file}
        )
        if not update_serializer.is_valid(raise_exception=True):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        Thread(
            target=async_update,
            args=(
                file.id,
                update_serializer.validated_data["column_idx_list"],
                update_serializer.validated_data["row_idx_list"],
                update_serializer.validated_data["translated_list"],
            ),
            daemon=True,
        ).start()
        return Response(update_serializer.validated_data, status=201)


class RevertCellView(APIView, JWTUserAuthentication):
    def post(self, request):
        user = self.get_authenticated_user(request=request)
        serializer = FindCSVFileSerializer(data=request.data, context={"user": user})
        if not serializer.is_valid(raise_exception=True):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        file = serializer.validated_data["file"]
        Thread(
            target=async_revert,
            args=(file.id, request.data["column_idx"], request.data["row_idx"]),
            daemon=True,
        ).start()
        return Response(status=201)


class CustomUserUpdateCellView(APIView, JWTUserAuthentication):
    def post(self, request):
        user = self.get_authenticated_user(request=request)
        serializer = FindCSVFileSerializer(data=request.data, context={"user": user})
        if not serializer.is_valid(raise_exception=True):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        file = serializer.validated_data["file"]
        Thread(
            target=async_update,
            args=(
                file.id,
                [request.data["column_idx"]],
                [request.data["row_idx"]],
                [(request.data["custom_text"], "custom")],
            ),
            daemon=True,
        ).start()
        return Response(status=201)


def async_file_delete(file_id):
    File.delete_file(file_id)


class CSVUploadView(APIView, JWTUserAuthentication):

    def post(self, request):
        csv_serializer = CSVFileSerializer(data=request.data)
        if not csv_serializer.is_valid():
            return Response(csv_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        uploaded_file = csv_serializer.validated_data["file"]
        file_name = uploaded_file.name

        user = self.get_authenticated_user(request=request)

        reader = csv.reader(TextIOWrapper(uploaded_file.file, encoding="utf-8"))
        all_rows = list(reader)

        columns_data = all_rows[0][0].split(";")
        cells_data = [[] for _ in columns_data]
        for row_idx, row in enumerate(all_rows[1:]):
            if len(row) != 0:
                for cell_idx, cell in enumerate(row[0].split(";")):
                    cells_data[cell_idx].append(cell)
        columns_list = []
        for col_idx, columns in enumerate(columns_data):
            cell_objs = []
            for cell_idx, cell in enumerate(cells_data[col_idx]):
                cell_objs.append(
                    Cell(
                        text=cell,
                        original_text=cell,
                        row_number=cell_idx,
                        is_translated=False,
                        detected_language="",
                    ).to_dict()
                )

            columns_list.append(
                Column(
                    name=columns,
                    column_number=col_idx,
                    rows_number=len(cell_objs),
                    cells=cell_objs,
                ).to_dict()
            )

        file_obj = File.objects.create(
            title=file_name,
            upload_time=datetime.now(),
            columns=columns_list,
            columns_number=len(columns_list),
        )

        file_obj.save()
        old_file_id = user.file
        if old_file_id is not None:
            Thread(
                target=async_file_delete,
                args=(old_file_id,),
                daemon=True,
            ).start()
        user.file = str(file_obj.id)
        user.save(update_fields=["file"])

        return Response(
            {"status": "success", "file_title": file_name, "id": str(file_obj.id)}
        )


class GetUserCSVFiles(APIView, JWTUserAuthentication):
    def get(self, request):
        user = self.get_authenticated_user(request=request)

        file = File.objects.filter(id=user.file).first()
        if file is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response({"file": file.to_dict()})


class DowloandCSVFile(APIView, JWTUserAuthentication):
    def post(self, request):
        user = self.get_authenticated_user(request=request)

        serializer = FindCSVFileSerializer(data=request.data, context={"user": user})
        if not serializer.is_valid(raise_exception=True):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data["file"].to_dict()
        if len(data["columns"]) == 0:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        columns = data["columns"][0]
        if len(columns["cells"]) == 0:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        csv_data = []
        csv_data.append([columns["name"]])
        for cell in columns["cells"]:
            csv_data.append([cell["text"]])

        for column in data["columns"][1:]:
            csv_data[0].append(column["name"])
            for cell_idx, cell in enumerate(column["cells"]):
                csv_data[cell_idx + 1].append(cell["text"])

        csv_file = StringIO()
        writer = csv.writer(csv_file, delimiter=";")
        writer.writerow(csv_data[0])
        writer.writerows(csv_data[1:])

        response = HttpResponse(
            csv_file.getvalue(), content_type="text/csv", status=status.HTTP_200_OK
        )
        filename = f"{data['title']}.csv"
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        return response
