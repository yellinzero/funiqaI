from configs import funiq_ai_config

# Create and run the FastApi app

# Entry point for running the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app", 
        host="0.0.0.0",  # noqa: S104
        port=5000, 
        reload=funiq_ai_config.DEBUG, 
        log_level="info"
    )
