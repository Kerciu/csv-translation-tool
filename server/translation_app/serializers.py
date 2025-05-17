from rest_framework import serializers

from .models import File


class CSVFileSerializer(serializers.Serializer):
    file = serializers.FileField()
    title = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        fields = ["file", "title"]

    def validate_file(self, value):
        if not value.name.endswith(".csv"):
            raise serializers.ValidationError({"file": "Uploaded file must be a CSV."})

        return value


class DowloandCSVFileSerializer(serializers.Serializer):
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
            return serializers.ValidationError(
                {"user": "User doesn't have such a File."}
            )

        file = File.objects.filter(id=file_id).first()
        if file is None:
            return serializers.ValidationError({"file": "File doesn't exist."})

        return {"file": file.to_dict()}
