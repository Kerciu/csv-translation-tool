import csv
from datetime import datetime
from io import StringIO, TextIOWrapper

from django.http import HttpResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from translation_module import translate as r_translate

from .models import Cell, Column, File
from .serializers import CSVFileSerializer, DowloandCSVFileSerializer
from .utils import JWTUserAuthentication


def find_language(request):
    return HttpResponse("I don't know")


def translate(request):
    return HttpResponse(r_translate("Rust love", "en", "es"))


class CSVUploadView(APIView, JWTUserAuthentication):

    def post(self, request):
        csv_serializer = CSVFileSerializer(data=request.data)
        if not csv_serializer.is_valid():
            return Response(csv_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        uploaded_file = csv_serializer.validated_data["file"]

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
                        row_number=cell_idx,
                        is_translated=False,
                        text_translated="",
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
            title=csv_serializer.validated_data["title"],
            upload_time=datetime.now(),
            columns=columns_list,
            columns_number=len(columns_list),
        )

        file_obj.save()

        user.files = user.files or []
        user.files.append(str(file_obj.id))
        user.save()

        return Response(
            {"status": "success", "file_title": file_obj.title, "id": str(file_obj.id)}
        )


class GetUserCSVFiles(APIView, JWTUserAuthentication):
    def get(self, request):
        user = self.get_authenticated_user(request=request)

        files = []
        for id in user.files:
            file = File.objects.filter(id=id).first()
            if file is None:
                continue
            files.append(file.to_dict())
        return Response({"files": files})


class DowloandCSVFile(APIView, JWTUserAuthentication):
    def get(self, request):
        user = self.get_authenticated_user(request=request)

        serializer = DowloandCSVFileSerializer(
            data=request.data, context={"user": user}
        )
        if not serializer.is_valid(raise_exception=True):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data["file"]
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

        response = HttpResponse(csv_file.getvalue(), content_type="text/csv")
        filename = f"{data['title']}.csv"
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        return response
