from fastapi.testclient import TestClient


def test_items_list_starts_empty(client: TestClient) -> None:
    response = client.get("/api/items")

    assert response.status_code == 200
    assert response.json() == {"items": []}


def test_create_item_returns_created_record(client: TestClient) -> None:
    payload = {
        "title": "Starter item",
        "description": "Useful for reshaping after the competition prompt arrives.",
        "status": "active",
    }

    response = client.post("/api/items", json=payload)

    assert response.status_code == 201
    body: dict[str, object] = response.json()
    assert body["title"] == payload["title"]
    assert body["description"] == payload["description"]
    assert body["status"] == payload["status"]
    assert isinstance(body["id"], int)
    assert body["created_at"]


def test_created_item_appears_in_list(client: TestClient) -> None:
    create_response = client.post(
        "/api/items",
        json={
            "title": "First item",
            "description": "Saved in database",
            "status": "draft",
        },
    )
    assert create_response.status_code == 201

    response = client.get("/api/items")

    assert response.status_code == 200
    body: dict[str, list[dict[str, object]]] = response.json()
    assert len(body["items"]) == 1
    assert body["items"][0]["title"] == "First item"
