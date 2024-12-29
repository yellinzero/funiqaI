from celery import Celery
from fastapi import FastAPI

from configs import funiq_ai_config


def create_celery_app(app: FastAPI) -> Celery:
    """
    Initialize and configure Celery with FastAPI.

    :param app: FastAPI application instance.
    :return: Configured Celery app instance.
    """

    celery_app = Celery(
        app.title,
        broker=funiq_ai_config.CELERY_BROKER_URL,
        backend=funiq_ai_config.CELERY_RESULT_BACKEND,
        broker_connection_retry_on_startup=True,
    )

    return celery_app


# Initialize Celery with FastAPI
def init_celery(app: FastAPI):
    """
    Attach Celery instance to FastAPI app.

    :param app: FastAPI instance.
    """
    celery_app = create_celery_app(app)
    app.state.celery = celery_app
