FROM rust:1.85.0 AS builder

WORKDIR /model

COPY tests /model/tests
COPY Cargo.toml /model/
COPY src /model/src
COPY scripts /model/scripts

RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-venv \
    build-essential curl git libssl-dev pkg-config patchelf

# RUN python3 -m pip install --break-system-packages maturin

RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

RUN pip install maturin

RUN maturin build --release --strip --out /model/target/wheels

FROM python:3.11-slim

WORKDIR /model

COPY --from=builder /model/target/wheels/*.whl /dist/

RUN pip install /dist/*.whl
