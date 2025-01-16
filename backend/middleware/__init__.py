"""
Manage global middlewares
"""

from fastapi import FastAPI
from fastapi_async_sqlalchemy import SQLAlchemyMiddleware

from database import engine
from middleware.auth import TokenRefreshMiddleware
from middleware.request_context import RequestContextMiddleware


def install_global_middlewares(app: FastAPI):
    app.add_middleware(RequestContextMiddleware)
    app.add_middleware(SQLAlchemyMiddleware, custom_engine=engine)
    app.add_middleware(TokenRefreshMiddleware)
    
