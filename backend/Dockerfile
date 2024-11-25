# Use Python 3.10 slim as base
FROM python:3.10-slim

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

# Expose the FastAPI port
EXPOSE 5000

# Command to run the FastAPI application
CMD ["python", "app.py"]