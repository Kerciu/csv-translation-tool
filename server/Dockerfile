FROM python:3.12-slim

WORKDIR /server

# Install system dependencies for Rust module
RUN apt-get update && \
    apt-get install -y libssl-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements first for caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Rust module from model build
COPY --from=model /model/*.whl .
RUN pip install --no-cache-dir translation_model-*.whl && \
    rm translation_model-*.whl

# Copy Django application
COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]