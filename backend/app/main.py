from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.responses import ORJSONResponse

from app.errors import register_exception_handlers
from app_manager import app_manager
from database import shutdown_database
from middleware import install_global_middlewares
from services.celery import init_celery
from services.email_service import init_email_service


# Define the FastAPI application with essential configurations
def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application.
    """
    app = FastAPI(
        title="FuniqAI",  # Title for the API documentation
        default_response_class=ORJSONResponse,  # Use ORJSON for faster JSON serialization
        lifespan=lifespan,  # Register lifecycle hooks
    )

    install_global_middlewares(app)
    app_manager.install_apps(["app.auth"])
    app_manager.apply_modules_to_fastapi(app)
    # Register routes and exception handlers
    register_routes(app)
    register_exception_handlers(app)
    # Register Email server
    init_email_service(app)
    # Resister Celery server
    init_celery(app)

    return app


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await shutdown_database()


# Define a health check route
def register_routes(app: FastAPI):
    """
    Register API routes.
    """
    @app.get("/api/health", tags=["Health Check"])
    def health_check():
        return {"status": "healthy"}
    

app = create_app()
celery = app.state.celery