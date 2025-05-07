FROM python:3.11-slim

WORKDIR /server

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && \
    apt-get install -y libssl-dev && \
    rm -rf /var/lib/apt/lists/*

COPY --from=translator-model:latest /wheels/*.whl /tmp/
COPY requirements.txt .

RUN pip install /tmp/*.whl

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
