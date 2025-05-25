from rest_framework import serializers
from translation_module import translate as translate_text

from .const import CANOOT_TRANSLATE, TEXT_ERROR
from .models import File


class FileUpdateCellsSerializer(serializers.Serializer):
    column_idx_list = serializers.ListField(child=serializers.IntegerField())
    row_idx_list = serializers.ListField(child=serializers.IntegerField())
    target_language = serializers.CharField()
    source_language = serializers.CharField()

    class Meta:
        fields = [
            "column_idx_list",
            "row_idx_list",
            "target_language",
            "source_language",
        ]

    def validate(self, attrs):
        file = self.context["file"]
        column_idx_list = attrs.get("column_idx_list")
        row_idx_list = attrs.get("row_idx_list")
        target_language = attrs.get("target_language")
        source_language = attrs.get("source_language")
        translated_texts = []
        columns_number = file.columns_number

        for n in range(0, len(column_idx_list)):
            if columns_number < column_idx_list[n]:
                translated_texts.append((TEXT_ERROR, ""))

            rows_number = file.columns[column_idx_list[n]].rows_number

            if rows_number < row_idx_list[n]:
                translated_texts.append((TEXT_ERROR, ""))

            text = file.columns[column_idx_list[n]].cells[row_idx_list[n]]["text"]
            try:
                translated_texts.append(
                    (
                        translate_text(text, source_language, target_language),
                        source_language,
                    )
                )
            except Exception:
                translated_texts.append((CANOOT_TRANSLATE, ""))
        attrs["translated_list"] = translated_texts
        print(translated_texts)
        return attrs


class CSVFileSerializer(serializers.Serializer):
    file = serializers.FileField()

    class Meta:
        fields = ["file"]

    def validate_file(self, value):
        if not value.name.endswith(".csv"):
            raise serializers.ValidationError({"file": "Uploaded file must be a CSV."})

        return value


class FindCSVFileSerializer(serializers.Serializer):

    def validate(self, attrs):
        user = self.context["user"]

        file_id = user.file

        if not file_id:
            raise serializers.ValidationError({"user": "User doesn't have any file."})

        file = File.objects.filter(id=file_id).first()
        if file is None:
            raise serializers.ValidationError({"file": "File doesn't exist."})

        return {"file": file}
