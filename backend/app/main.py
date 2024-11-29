from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.requests import Request
from fastapi.responses import JSONResponse, ORJSONResponse

from app.errors.base import FuniqAIError
from app_manager import app_manager
from database import shutdown_database
from middleware import install_global_middlewares


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
    

# Exception handler registration
def register_exception_handlers(app: FastAPI):
    """
    Register exception handlers for standardized error responses.
    :param app: FastAPI application instance.
    """
    @app.exception_handler(FuniqAIError)
    def recurve_exception_handler(request: Request, exc: FuniqAIError):
        """
        Handle FuniqAIError and return a standardized JSON response.
        :param request: Incoming request.
        :param exc: Raised FuniqAIError.
        :return: JSONResponse with error details.
        """
        return JSONResponse(
            status_code=exc.status_code,
            content=exc.to_dict(),
        )

    @app.exception_handler(RequestValidationError)
    def request_validation_exception_handler(request: Request, exc: RequestValidationError):
        """
        Handle FastAPI's RequestValidationError and return a standardized JSON response.
        :param request: Incoming request.
        :param exc: Raised RequestValidationError.
        :return: JSONResponse with validation errors.
        """
        return JSONResponse(
            status_code=400,
            content={
                "code": "INVALID_ARGUMENT",
                "message": "Invalid input data",
                "data": jsonable_encoder(exc.errors()),
            },
        )