from flask import jsonify


def register_routes(app):
    @app.route("/health", methods=["GET"])
    def health_check():
        return jsonify({"status": "healthy"})
