"""
Manage global middlewares
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_async_sqlalchemy import SQLAlchemyMiddleware

from configs import funiq_ai_config
from database import engine
from middleware.auth import TokenRefreshMiddleware
from middleware.request_context import RequestContextMiddleware


def install_global_middlewares(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=funiq_ai_config.CORS_ALLOW_ORIGINS,
        allow_credentials=funiq_ai_config.CORS_ALLOW_CREDENTIALS,
        allow_methods=funiq_ai_config.CORS_ALLOW_METHODS,
        allow_headers=funiq_ai_config.CORS_ALLOW_HEADERS,
    )
    app.add_middleware(SQLAlchemyMiddleware, custom_engine=engine)
    app.add_middleware(RequestContextMiddleware)
    app.add_middleware(TokenRefreshMiddleware)
