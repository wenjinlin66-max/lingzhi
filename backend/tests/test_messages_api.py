from fastapi.testclient import TestClient
from sqlalchemy.orm import Session


def test_room_messages_flow_uses_matched_anonymous_identity(client: TestClient, db_session: Session) -> None:
    match_response = client.post(
        "/api/match",
        json={
            "session_token": "session-001",
            "analysis": {
                "primary_emotion": "anxious",
                "secondary_emotion": "lonely",
                "valence": -0.7,
                "arousal": 0.8,
                "intensity": 4,
                "keywords": ["压力", "疲惫"],
                "summary": "高唤醒焦虑",
                "provider": "mock",
            },
        },
    )

    assert match_response.status_code == 200
    matched_nickname = match_response.json()["nickname"]

    create_response = client.post(
        "/api/rooms/anxious-4/messages",
        json={
            "session_token": "session-001",
            "content": "有人也会在晚上突然很焦虑吗？",
        },
    )

    assert create_response.status_code == 200

    list_response = client.get("/api/rooms/anxious-4/messages")
    assert list_response.status_code == 200
    body: dict[str, list[dict[str, object]]] = list_response.json()
    assert len(body["messages"]) == 1
    assert body["messages"][0]["content"] == "有人也会在晚上突然很焦虑吗？"
    assert body["messages"][0]["nickname"] == matched_nickname
    assert body["messages"][0]["avatar_color"] == "anxious"


def test_room_state_endpoint_works(client: TestClient) -> None:
    response = client.get("/api/rooms/anxious-4")
    assert response.status_code == 200
    body: dict[str, object] = response.json()
    assert body["room_id"] == "anxious-4"
    assert body["emotion_bucket"] == "anxious"
