import csv
from datetime import datetime
from io import StringIO, TextIOWrapper
from threading import Thread

from django.http import HttpResponse
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .apps import get_is_busy, set_busy
from .models import Cell, Column, File
from .serializers import (
    CSVFileSerializer,
    FileUpdateCellsSerializer,
    FindCSVFileSerializer,
    UpdateCellSerializer,
)
from .utils import JWTUserAuthentication


def async_update(file_id, idx_list, translated):
    File.update_cells(file_id, idx_list, translated)


def async_revert(file_id, column_idx, row_idx):
    File.revert_cell(file_id, column_idx, row_idx)


class TranslateCellsView(APIView, JWTUserAuthentication):

    @swagger_auto_schema(
        tags=["CSV Operations"],
        request_body=FileUpdateCellsSerializer,
        operation_description="Translate selected cells in a CSV file.",
        manual_parameters=[
            openapi.Parameter(
                "jwt token",
                openapi.IN_HEADER,
                description="JWT token from cookie",
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                "Column idx list",
                openapi.IN_HEADER,
                description="Column indexes list of csv file to translate",
                type=openapi.TYPE_ARRAY,
                items=openapi.Items(type=openapi.TYPE_INTEGER),
            ),
            openapi.Parameter(
                "Row idx list",
                openapi.IN_HEADER,
                description="Row indexes list of csv file to translate",
                type=openapi.TYPE_ARRAY,
                items=openapi.Items(type=openapi.TYPE_INTEGER),
            ),
            openapi.Parameter(
                "Source language",
                openapi.IN_HEADER,
                description='Source language to translate from to || or "any" language',
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                "Target language",
                openapi.IN_HEADER,
                description="Target language to translate text to",
                type=openapi.TYPE_STRING,
            ),
        ],
        responses={
            201: openapi.Response(
                description="List of translated data",
                schema=FileUpdateCellsSerializer,
            ),
            400: "Bad request",
        },
    )
    def post(self, request):
        user = self.get_authenticated_user(request=request)
        serializer = FindCSVFileSerializer(data=request.data, context={"user": user})
        if not serializer.is_valid(raise_exception=True):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        file = serializer.validated_data["file"]
        set_busy(True)
        update_serializer = FileUpdateCellsSerializer(
            data=request.data, context={"file": file}
        )
        if not update_serializer.is_valid(raise_exception=True):
            set_busy(False)
            return Response(
                update_serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )
        set_busy(False)

        Thread(
            target=async_update,
            args=(
                file.id,
                update_serializer.validated_data["idx_list"],
                update_serializer.validated_data["translated_list"],
            ),
            daemon=True,
        ).start()
        return Response(update_serializer.validated_data, status=201)


class RevertCellView(APIView, JWTUserAuthentication):

    @swagger_auto_schema(
        tags=["CSV Operations"],
        request_body=UpdateCellSerializer,
        operation_description=(
            "Revert a single translated cell back to its original state."
        ),
        manual_parameters=[
            openapi.Parameter(
                "jwt token",
                openapi.IN_HEADER,
                description="JWT token from cookie",
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                "Column idx",
                openapi.IN_HEADER,
                description="Column indexes list of csv file to revert",
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                "Row idx",
                openapi.IN_HEADER,
                description="Row indexes list of csv file to revert",
                type=openapi.TYPE_STRING,
            ),
        ],
        responses={201: "", 400: "Bad request"},
    )
    def post(self, request):
        user = self.get_authenticated_user(request=request)
        serializer = FindCSVFileSerializer(data=request.data, context={"user": user})
        if not serializer.is_valid(raise_exception=True):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        file = serializer.validated_data["file"]
        idx_serializer = UpdateCellSerializer(data=request.data, context={"file": file})
        if not idx_serializer.is_valid(raise_exception=True):
            return Response(idx_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        Thread(
            target=async_revert,
            args=(
                file.id,
                idx_serializer.validated_data["column_idx"],
                idx_serializer.validated_data["row_idx"],
            ),
            daemon=True,
        ).start()
        return Response(status=201)


class CustomUserUpdateCellView(APIView, JWTUserAuthentication):

    @swagger_auto_schema(
        tags=["CSV Operations"],
        operation_description="Manually update a specific cell with custom text.",
        manual_parameters=[
            openapi.Parameter(
                "jwt token",
                openapi.IN_HEADER,
                description="JWT token from cookie",
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                "Column idx",
                openapi.IN_HEADER,
                description="Column indexes list of csv file to update",
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                "Row idx",
                openapi.IN_HEADER,
                description="Row indexes list of csv file to update",
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                "Text",
                openapi.IN_HEADER,
                description="Text to update cell",
                type=openapi.TYPE_STRING,
            ),
        ],
        responses={201: "", 400: "Bad request"},
    )
    def post(self, request):
        user = self.get_authenticated_user(request=request)
        serializer = FindCSVFileSerializer(data=request.data, context={"user": user})
        if not serializer.is_valid(raise_exception=True):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        file = serializer.validated_data["file"]
        idx_serializer = UpdateCellSerializer(data=request.data, context={"file": file})
        if not idx_serializer.is_valid(raise_exception=True):
            return Response(idx_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        Thread(
            target=async_update,
            args=(
                file.id,
                [
                    (
                        idx_serializer.validated_data["column_idx"],
                        idx_serializer.validated_data["row_idx"],
                    )
                ],
                [(request.data["custom_text"], "", True)],
            ),
            daemon=True,
        ).start()
        return Response(status=201)


def async_file_delete(file_id):
    File.delete_file(file_id)


class CSVUploadView(APIView, JWTUserAuthentication):

    @swagger_auto_schema(
        tags=["CSV Operations"],
        request_body=CSVFileSerializer,
        operation_description=(
            "Upload a CSV file, parse it,"
            + "store it in the database and delete from database user's old csv."
        ),
        manual_parameters=[
            openapi.Parameter(
                "jwt token",
                openapi.IN_HEADER,
                description="JWT token from cookie",
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                ".csv File",
                openapi.IN_HEADER,
                description="File to be uploaded",
                type=openapi.TYPE_FILE,
            ),
        ],
        responses={
            200: openapi.Response(
                description="Success response with file data",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "status": openapi.Schema(type=openapi.TYPE_STRING),
                        "file_title": openapi.Schema(type=openapi.TYPE_STRING),
                        "file_id": openapi.Schema(type=openapi.TYPE_STRING),
                    },
                ),
            ),
            400: "Bad request",
        },
    )
    def post(self, request):
        user = self.get_authenticated_user(request=request)

        csv_serializer = CSVFileSerializer(data=request.data)
        if not csv_serializer.is_valid():
            return Response(csv_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if get_is_busy():
            return Response(csv_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        uploaded_file = csv_serializer.validated_data["file"]
        file_name = uploaded_file.name

        reader = csv.reader(TextIOWrapper(uploaded_file.file, encoding="utf-8"))
        all_rows = list(reader)
        if ";" in all_rows[0][0]:
            columns_data = all_rows[0][0].split(";")

            cells_data = [[] for _ in columns_data]
            for row in all_rows[1:]:
                if len(row) != 0:
                    for cell_idx, cell in enumerate(row[0].split(";")):
                        cells_data[cell_idx].append(cell)
        else:
            columns_data = all_rows[0]

            cells_data = [[] for _ in columns_data]
            for row in all_rows[1:]:
                if len(row) != 0:
                    for cell_idx, cell in enumerate(row):
                        cells_data[cell_idx].append(cell)
        columns_list = []
        for col_idx, column_name in enumerate(columns_data):
            cell_objs = [
                Cell(
                    text=cell,
                    original_text=cell,
                    row_number=cell_idx,
                    is_translated=False,
                    detected_language="",
                ).to_dict()
                for cell_idx, cell in enumerate(cells_data[col_idx])
            ]
            columns_list.append(
                Column(
                    name=column_name,
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
        try:
            if old_file_id is not None:
                Thread(
                    target=async_file_delete, args=(old_file_id,), daemon=True
                ).start()
        except Exception:
            print("No such file")
        user.file = str(file_obj.id)
        user.save(update_fields=["file"])

        return Response(
            {"status": "success", "file_title": file_name, "id": str(file_obj.id)}
        )


class GetUserCSVFiles(APIView, JWTUserAuthentication):

    @swagger_auto_schema(
        tags=["CSV Operations"],
        operation_description=(
            "Get the currently active CSV file for the authenticated user."
        ),
        manual_parameters=[
            openapi.Parameter(
                "jwt token",
                openapi.IN_HEADER,
                description="JWT token from cookie",
                type=openapi.TYPE_STRING,
            ),
        ],
        responses={
            200: openapi.Response(
                description="Found user's file as dict",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "file": openapi.Schema(type=openapi.TYPE_STRING),
                    },
                ),
            ),
            400: "Bad request",
        },
    )
    def get(self, request):
        user = self.get_authenticated_user(request=request)
        file = File.objects.filter(id=user.file).first()
        if file is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response({"file": file.to_dict()})


class DowloandCSVFile(APIView, JWTUserAuthentication):

    @swagger_auto_schema(
        tags=["CSV Operations"],
        operation_description="Download the user's CSV file with translated values.",
        manual_parameters=[
            openapi.Parameter(
                "jwt token",
                openapi.IN_HEADER,
                description="JWT token from cookie",
                type=openapi.TYPE_STRING,
            ),
        ],
        responses={
            200: openapi.Response(
                description="Success response with attached file",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "attached file": openapi.Schema(type=openapi.TYPE_FILE),
                    },
                ),
            ),
            400: "Bad request",
        },
    )
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

        csv_data = [[columns["name"]]]
        for cell in columns["cells"]:
            csv_data.append([cell["text"]])
        for column in data["columns"][1:]:
            csv_data[0].append(column["name"])
            for idx, cell in enumerate(column["cells"]):
                csv_data[idx + 1].append(cell["text"])

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
