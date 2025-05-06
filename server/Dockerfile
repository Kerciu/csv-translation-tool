FROM python:3.11-slim

WORKDIR /server

# COPY --from=translator-model:latest /*.whl /tmp/

COPY requirements.txt .

RUN apt-get update && \
    apt-get install -y libssl-dev && \
    rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir -r requirements.txt
    # pip install /tmp/*.whl
COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]