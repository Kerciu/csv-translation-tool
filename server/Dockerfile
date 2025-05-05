FROM python:3.12-slim

WORKDIR /server

RUN apt-get update && \
    apt-get install -y libssl-dev && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY --from=translator-model /model/*.whl .

RUN pip install --no-cache-dir translation_model-*.whl && \
    rm translation_model-*.whl

COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
