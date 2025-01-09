from app.account import app

from .routes import account_router

app.router.include_router(account_router)
