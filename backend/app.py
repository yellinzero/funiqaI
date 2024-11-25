from app.main import create_app

# Create and run the Flask app
app = create_app()

# Entry point for running the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(create_app(), host="0.0.0.0", port=5000)  # noqa: S104
