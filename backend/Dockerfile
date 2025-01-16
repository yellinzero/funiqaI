# Use Python 3.10 slim as base
FROM python:3.10-slim-bookworm

# Set the working directory
WORKDIR /app

# Install Poetry and system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && pip install poetry \
    && rm -rf /var/lib/apt/lists/*

# Copy only dependency files first
COPY pyproject.toml poetry.lock /app/

# Install dependencies without creating a virtual environment
RUN poetry config virtualenvs.create false \
    && poetry install --without dev --no-interaction --no-ansi \
    && rm -rf ~/.cache/pypoetry

# Copy the entrypoint script and set executable permissions
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copy the application code last
COPY . /app

# Expose FastAPI port
EXPOSE 5000

# Default entrypoint
ENTRYPOINT ["/entrypoint.sh"]
