from fastapi.testclient import TestClient


def test_analyze_endpoint_returns_structured_emotion(client: TestClient) -> None:
    response = client.post(
        "/api/analyze",
        json={
            "text": "今天真的很累，有点焦虑，也有点想找个人聊聊。",
        },
    )

    assert response.status_code == 200
    body: dict[str, object] = response.json()
    assert body["primary_emotion"]
    assert body["secondary_emotion"]
    assert isinstance(body["keywords"], list)
    assert body["summary"]
    assert body["provider"] == "mock"
