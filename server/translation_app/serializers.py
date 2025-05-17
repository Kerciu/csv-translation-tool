from rest_framework import serializers
from translation_module import translate as translate_text

from .models import File


class FileUpdateCellSerializer(serializers.Serializer):
    column_number = serializers.IntegerField()
    row_number = serializers.IntegerField()

    class Meta:
        fields = ["column_number", "row_number"]

    def validate(self, attrs):
        file = self.context["file"]
        column_number = attrs.get("column_number")
        row_number = attrs.get("row_number")
        if file.columns_number < column_number:
            raise serializers.ValidationError({"file": "Invalid column number"})
        if file.columns[column_number]["rows_number"] < row_number:
            raise serializers.ValidationError({"file": "Invalid row number"})
        try:
            # find first language of text
            # example solution
            attrs["translated"] = translate_text("Rust love", "en", "es")
        except Exception:
            raise serializers.ValidationError({"text": "Can't translate"})

        return attrs


class CSVFileSerializer(serializers.Serializer):
    file = serializers.FileField()
    title = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        fields = ["file", "title"]

    def validate_file(self, value):
        if not value.name.endswith(".csv"):
            raise serializers.ValidationError({"file": "Uploaded file must be a CSV."})

        return value


class FindCSVFileSerializer(serializers.Serializer):
    file_id = serializers.CharField()

    class Meta:
        fields = ["file_id"]

    def validate(self, attrs):
        user = self.context["user"]
        file_id = attrs["file_id"]

        validated = False
        for id in user.files:
            if str(id) == str(file_id):
                validated = True

        if not validated:
            raise serializers.ValidationError(
                {"user": "User doesn't have such a File."}
            )

        file = File.objects.filter(id=file_id).first()
        if file is None:
            raise serializers.ValidationError({"file": "File doesn't exist."})

        return {"file": file}
