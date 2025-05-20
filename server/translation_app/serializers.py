from langdetect import DetectorFactory, detect, lang_detect_exception
from rest_framework import serializers

from .models import File

# from translation_module import translate as translate_text


DetectorFactory.seed = 0


class FileUpdateCellSerializer(serializers.Serializer):
    column_number = serializers.IntegerField()
    row_number = serializers.IntegerField()
    target_language = serializers.CharField()
    source_language = serializers.CharField()

    class Meta:
        fields = ["column_number", "row_number", "target_language", "source_language"]

    def validate(self, attrs):
        file = self.context["file"]
        column_number = attrs.get("column_number")
        row_number = attrs.get("row_number")
        # target_language = attrs.get("target_language")
        if file.columns_number < column_number:
            raise serializers.ValidationError({"file": "Invalid column number"})
        if file.columns[column_number].rows_number < row_number:
            raise serializers.ValidationError({"file": "Invalid row number"})
        text = file.columns[column_number].cells[row_number]["text"]
        try:
            detected_language = detect(text=text)
            attrs["detected_language"] = detected_language
        except lang_detect_exception.LangDetectException:
            raise serializers.ValidationError({"detect": "Cannot detext any language"})

        try:
            # temporary solution because model doesn't work
            attrs["translated"] = "sucess"
            # attrs["translated"] = translate_text(
            #    text, detected_language, target_language
            # )
        except Exception:
            raise serializers.ValidationError({"text": "Can't translate"})

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
