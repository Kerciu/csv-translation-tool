from rest_framework import serializers

from .models import File
from .rust_loader import get_translator
from .utils import is_valid_language_code


class FileUpdateCellsSerializer(serializers.Serializer):
    """Serializer for updating multiple cells in a file with translated text.

    Args:
        column_idx_list: List of column indexed to update.
        row_idx_list: List of row indexes to update.
        target_language: Target language for translation.

    Returns:
        Validated data with translation_text_list [(text, detected_lang)].
    """

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
        """
        Validates indices.
        Attempts to retrieve translations from cache or via rust translation module.
        """
        file = self.context["file"]
        column_idx_list = attrs.get("column_idx_list")
        row_idx_list = attrs.get("row_idx_list")
        target_language = attrs.get("target_language")
        source_language = attrs.get("source_language")
        if not is_valid_language_code(target_language):
            raise serializers.ValidationError({"Language": "Invalid Target language."})
        if not is_valid_language_code(source_language) and source_language != "auto":
            raise serializers.ValidationError({"Language": "Invalid Source language."})

        idx_list = []
        texts = []
        columns_number = file.columns_number
        for n in range(0, len(column_idx_list)):
            if columns_number <= column_idx_list[n] or column_idx_list[n] < 0:
                continue

            rows_number = file.columns[column_idx_list[n]].rows_number

            if rows_number <= row_idx_list[n] or row_idx_list[n] < 0:
                continue

            text = file.columns[column_idx_list[n]].cells[row_idx_list[n]]["text"]
            texts.append(text)
            idx_list.append((column_idx_list[n], row_idx_list[n]))
        translator = get_translator()
        translated_list = translator.translate_batch(
            texts,
            source_language,
            target_language,
        )
        attrs["translated_list"] = translated_list
        print(translated_list)
        print(idx_list)
        attrs["idx_list"] = idx_list
        return attrs


class UpdateCellSerializer(serializers.Serializer):
    """Serializer for validating existance of cell within a file.

    Args:
        column_idx: Index of the column.
        row_idx: Index of the row.
    Returns:
        Validated column and row data.
    """

    column_idx = serializers.IntegerField()
    row_idx = serializers.IntegerField()

    class Meta:
        fields = [
            "column_idx",
            "row_idx",
        ]

    def validate(self, attrs):
        """
        Validates that the column and row indexes exist in the file.
        """
        file = self.context["file"]
        column_idx = attrs.get("column_idx")

        if file.columns_number <= column_idx or column_idx < 0:
            raise serializers.ValidationError({"file": "Invalid column number."})

        rows_number = file.columns[column_idx].rows_number

        if rows_number <= attrs.get("row_idx") or attrs.get("row_idx") < 0:
            raise serializers.ValidationError({"file": "Invalid row number."})

        return attrs


class CSVFileSerializer(serializers.Serializer):
    """Serializer for uploading a CSV file.

    Args:
        file: Uploaded CSV file.
    Returns:
        Validated file data.
    """

    file = serializers.FileField()

    class Meta:
        fields = ["file"]

    def validate_file(self, value):
        """
        Ensures the uploaded file has a `.csv` extension.
        """
        if not value.name.endswith(".csv"):
            raise serializers.ValidationError({"file": "Uploaded file must be a CSV."})

        return value


class FindCSVFileSerializer(serializers.Serializer):
    """Serializer for locating a CSV file associated with a user.
    Args:
        user: user instance parsed in context
    Returns:
        User's file
    """

    def validate(self, attrs):
        """
        Validates that the user has a file and that the file exists.
        """
        user = self.context["user"]

        file_id = user.file

        if not file_id:
            raise serializers.ValidationError({"user": "User doesn't have any file."})

        file = File.objects.filter(id=file_id).first()
        if file is None:
            raise serializers.ValidationError({"file": "File doesn't exist."})

        return {"file": file}
