import csv
from datetime import datetime
from io import TextIOWrapper

from auth_app.serializers import UserAuthSerializer
from django.http import HttpResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from translation_module import translate as r_translate

from .models import Cell, Column, File
from .serializers import CSVFileSerializer


def find_language(request):
    return HttpResponse("I don't know")


def translate(request):
    return HttpResponse(r_translate("Rust love", "en", "es"))


class CSVUploadView(APIView):

    def post(self, request):
        csv_serializer = CSVFileSerializer(data=request.data)
        if not csv_serializer.is_valid():
            return Response(csv_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        uploaded_file = csv_serializer.validated_data["file"]

        serializer = UserAuthSerializer(data={"token": request.COOKIES.get("jwt")})
        if not serializer.is_valid(raise_exception=True):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.validated_data

        reader = csv.reader(TextIOWrapper(uploaded_file.file, encoding="utf-8"))
        all_rows = list(reader)

        columns_data = {}
        for row_idx, row in enumerate(all_rows):
            for col_idx, text in enumerate(row):
                columns_data.setdefault(col_idx, []).append((row_idx, text))

        columns = []
        for col_idx, cells in columns_data.items():
            cell_objs = [
                Cell(
                    text=text,
                    row_number=row_num,
                    is_translated=False,
                    text_translated="",
                    detected_language="",
                )
                for row_num, text in cells
            ]
            columns.append(
                Column(
                    name=f"Column {col_idx}",
                    column_number=col_idx,
                    rows_number=len(cell_objs),
                    cells=cell_objs,
                ).to_dict()
            )

        file_obj = File.objects.create(
            title=csv_serializer.validated_data["title"],
            upload_time=datetime.now(),
            columns=columns,
            columns_number=len(columns),
        )

        file_obj.save()

        user.files = user.files or []
        user.files.append(str(file_obj.id))
        user.save()

        return Response({"status": "success", "file_title": file_obj.title})


class GetUserCSVFiles(APIView):
    def get_queryset(self, request):
        return self.request.user.files or []
