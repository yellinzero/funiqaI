from fastapi.testclient import TestClient

from app.main import app


def test_health_check():
    client = TestClient(app)
    
    response = client.get("/health")
    if response.status_code != 200:
        raise AssertionError(f"Expected status code 200, got {response.status_code}")
    if response.json() != {"status": "healthy"}:
        raise AssertionError('Expected response {"status": "healthy"}, got ' + str(response.json()))
