from dotenv import load_dotenv
from flask import Flask

from app.routes import register_routes

load_dotenv()


def create_app():
    app = Flask(__name__)
    app.config.from_pyfile("config.py")

    register_routes(app)

    return app
