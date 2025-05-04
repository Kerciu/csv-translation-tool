FROM rust:1.85.0 as builder

WORKDIR /model
COPY . .

# Install system dependencies including patchelf
RUN apt-get update && \
    apt-get install -y python3 python3-venv patchelf && \
    python3 -m venv /opt/venv

RUN /opt/venv/bin/pip install maturin

RUN /opt/venv/bin/maturin build --release --strip

# Final stage
FROM python:3.12-slim
WORKDIR /model
COPY --from=builder /model/target/wheels/*.whl .
RUN pip install --no-cache-dir *.whl tokenizers hf-hub