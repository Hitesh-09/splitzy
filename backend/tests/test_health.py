from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["version"] == "0.1.0"


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Splitzy API"
    assert data["health"] == "/health"


def test_auth_me_unauthorized_without_token():
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401


def test_auth_me_with_mock_user_id():
    test_uuid = "11111111-1111-1111-1111-111111111111"
    response = client.get(
        "/api/v1/auth/me",
        headers={"X-Mock-User-Id": test_uuid}
    )
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["data"]["id"] == test_uuid
