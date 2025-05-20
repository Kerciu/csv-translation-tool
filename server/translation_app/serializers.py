from langdetect import DetectorFactory, detect, lang_detect_exception
from rest_framework import serializers

from .const import CANNOT_DETECT_LANGUAGE, CANOOT_TRANSLATE, TEXT_ERROR
from .models import File

# from translation_module import translate as translate_text


DetectorFactory.seed = 0


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
        # target_language = attrs.get("target_language")
        # source_language = attrs.get("source_language")
        detected_languages = []
        texts = []
        columns_number = file.columns_number
        for n in range(0, len(column_idx_list)):
            if columns_number < column_idx_list[n]:
                texts.append(TEXT_ERROR)

            rows_number = file.columns[column_idx_list[n]].rows_number

            if rows_number < row_idx_list[n]:
                texts.append(TEXT_ERROR)

            text = file.columns[column_idx_list[n]].cells[row_idx_list[n]]["text"]
            try:
                detected_language = detect(text=text)
                detected_languages.append(detected_language)
            except lang_detect_exception.LangDetectException:
                texts.append(CANNOT_DETECT_LANGUAGE)
                detected_languages.append(CANNOT_DETECT_LANGUAGE)
            try:
                # temporary solution because model doesn't work
                texts.append("sucess")
                #  texts.append(translate_text(
                #    text, detected_language, target_language
                # ))
            except Exception:
                texts.append(CANOOT_TRANSLATE)
        attrs["detected_languages"] = detected_languages
        attrs["translated_list"] = texts
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
