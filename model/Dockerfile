FROM rust:1.85.0 AS builder

WORKDIR /model

COPY . .

RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-venv \
    build-essential curl git libssl-dev pkg-config patchelf

RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

RUN pip install maturin

RUN maturin build --release --strip --out /wheels

FROM alpine:latest AS export

COPY --from=builder /wheels /wheels
