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

RUN mkdir -p /model/wheels

RUN maturin build --release --strip --out /model/wheels && ls -la /model/wheels

# instead of python-slim

# FROM scratch AS export
# COPY --from=builder /model/wheels/*.whl /

# but for now

FROM python:3.11-slim

WORKDIR /model

# Copy built wheels
COPY --from=builder /model/wheels/*.whl /dist/

# Copy necessary files from builder stage
COPY --from=builder /model/scripts ./scripts/
COPY --from=builder /model/tests ./tests/

# Install the package
RUN pip install /dist/*.whl

# Optional: Copy other needed files from host
COPY . .

