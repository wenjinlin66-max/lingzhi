from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.session import Session as ChatSession


def test_match_endpoint_returns_room_and_identity(client: TestClient, db_session: Session) -> None:
    response = client.post(
        "/api/match",
        json={
            "session_token": "session-123",
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

    assert response.status_code == 200
    body: dict[str, object] = response.json()
    assert body["recommended_surface"] == "rooms"
    assert body["recommended_strategy"] == "similar"
    assert body["nickname"]
    surfaces = body["surfaces"]
    assert isinstance(surfaces, list)
    assert len(surfaces) >= 2
    first_surface = surfaces[0]
    assert first_surface["surface_key"] == "rooms"
    strategies = first_surface["strategies"]
    assert isinstance(strategies, list)
    assert len(strategies) >= 1
    first_group = strategies[0]
    assert first_group["strategy_key"] == "similar"
    assert isinstance(first_group["suggestions"], list)
    assert first_group["suggestions"][0]["vibe_key"] == "anxious"

    session = db_session.execute(
        select(ChatSession).where(ChatSession.session_token == "session-123")
    ).scalar_one_or_none()
    assert session is not None
    assert session.nickname == body["nickname"]
