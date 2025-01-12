# Funiq AI Backend

The backend service for Funiq AI, built with FastAPI and modern Python stack.

## 🛠 Tech Stack

- **Framework:** FastAPI
- **Database:** PostgreSQL 15+
- **Cache:** Redis 6
- **Task Queue:** Celery
- **Container:** Docker & Docker Compose
- **Package Manager:** Poetry
- **Code Quality:** Ruff

## 📋 Prerequisites

- Python 3.10+
- Poetry
- Docker & Docker Compose

## 🚀 Getting Started

1. **Clone and Setup Environment**

```bash
# Clone the repository
cd backend

# Copy environment file
cp .env.example .env
```

2. **Start Development Environment**

```bash
# Build and start all services in development mode
docker compose up -d --build

# Check logs
docker compose logs -f server
```

Services will be available at:
- FastAPI Server: http://localhost:5001
- PostgreSQL: localhost:5432
- Redis: localhost:6379

3. **Database Setup**

```bash
# Run database migrations
poetry run alembic upgrade head
```

## 🔧 Development Tools

```bash
# Code formatting
poetry run ruff format .

# Code linting
poetry run ruff check .

# Run tests
poetry run pytest

# Run with coverage
poetry run coverage run -m pytest
poetry run coverage report
```

## 📚 API Documentation

Once the server is running, access:
- Swagger UI: http://localhost:5001/docs
- ReDoc: http://localhost:5001/redoc

## 🔧 Project Structure

```
backend/
├── app/                 # Main application package
│   ├── auth/            # Authentication and authorization
│   ├── account/         # User account management
│   ├── errors/          # Custom error handlers and exceptions
│   ├── models/          # SQLAlchemy database models
│   ├── main.py          # FastAPI application factory
│   └── schemas.py       # Pydantic data models and validators
├── configs/             # Application configuration and settings
├── database/            # Database connection and session management
├── docker/              # Docker-related configuration files
├── middleware/          # CORS, authentication and other middleware
├── migrations/          # Alembic database migrations
├── services/            # External service integrations (email, celery)
├── tasks/               # Background tasks and Celery workers
├── templates/           # Jinja2 email templates
├── tests/               # Test suite
│   ├── routes/          # API endpoint tests
│   ├── services/        # Service layer tests
│   └── utils/           # Utility function tests
├── utils/               # Helper functions and utilities
├── volumes/             # Persistent data volumes for Docker
├── .env.example         # Environment variable template
├── alembic.ini          # Alembic migrations config
├── app_manager.py       # Application module manager
├── app.py               # Application entry point
├── docker-compose.yml   # Docker services orchestration
├── Dockerfile           # Container build instructions
├── poetry.lock          # Locked dependencies
├── poetry.toml          # Poetry settings
├── pyproject.toml       # Project metadata and dependencies
└── pytest.ini           # Pytest configuration

```

## 🔑 Environment Variables

Key environment variables (see `.env.example` for full list)

## 🚀 Production Deployment(WIP)

The application is designed to be environment-driven. To deploy in production:

1. Set up appropriate environment variables (see `.env.example`)
2. Deploy using your preferred container orchestration solution
3. Run database migrations before starting the application

Key production considerations:
- Ensure `DEBUG=false` in production
- Use strong `SECRET_KEY`
- Configure secure database credentials
- Set up proper SMTP settings
- Configure appropriate logging

## 📝 License

Apache-2.0 License
