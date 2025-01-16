from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.responses import ORJSONResponse

from app.errors import register_exception_handlers
from app_manager import app_manager
from configs import funiq_ai_config
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

    # Register exception handlers
    register_exception_handlers(app)
    
    # Install middleware
    install_global_middlewares(app)

    # Use INSTALLED_APPS from config
    app_manager.install_apps(funiq_ai_config.INSTALLED_APPS)
    app_manager.apply_modules_to_fastapi(app)

    # Register routes
    register_routes(app)

    # Initialize services
    init_email_service(app)  # Email service
    init_celery(app)        # Celery task queue

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

    @app.get("/health", tags=["Health Check"])
    def health_check():
        return {"status": "healthy"}


app = create_app()
celery = app.state.celery
