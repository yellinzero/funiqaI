from app.auth import app

from .routes import auth_router

app.router.include_router(auth_router)