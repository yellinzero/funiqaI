"""
Manage global middlewares
"""

from fastapi import FastAPI
from fastapi_async_sqlalchemy import SQLAlchemyMiddleware

from database import engine


def install_global_middlewares(app: FastAPI):
    app.add_middleware(SQLAlchemyMiddleware, custom_engine=engine)
    
