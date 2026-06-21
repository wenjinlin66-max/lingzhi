from fastapi.testclient import TestClient


def test_meta_endpoint_returns_application_info(client: TestClient) -> None:
    response = client.get("/api/meta")

    assert response.status_code == 200

    body: dict[str, object] = response.json()
    assert body["appName"] == "VibeChat API"
    assert body["environment"] == "development"
    assert body["version"] == "0.1.0"
    assert body["databaseConnected"] is True
