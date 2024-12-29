# Use Python 3.10 slim as base
FROM python:3.10-slim-bookworm

# Set the working directory
WORKDIR /app

# Install Poetry
RUN pip install poetry

# Copy the Poetry configuration files
COPY pyproject.toml poetry.lock /app/

# Install dependencies without creating a virtual environment
RUN poetry config virtualenvs.create false && poetry install --no-dev --no-interaction --no-ansi

# Copy the application code
COPY . /app

# Expose FastAPI port
EXPOSE 5000

# Copy the entrypoint script and set executable permissions
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Default entrypoint
ENTRYPOINT ["/entrypoint.sh"]
