from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from backend.app.services.realtime_service import room_connection_manager

router = APIRouter()


@router.websocket("/rooms/{room_id}/ws")
async def room_websocket(websocket: WebSocket, room_id: str) -> None:
    participant_id = websocket.query_params.get("participantId", "anonymous")
    await room_connection_manager.connect(room_id, websocket)
    await room_connection_manager.broadcast(
        room_id,
        {
            "type": "system",
            "payload": {"text": f"{participant_id} 已进入房间。"},
        },
    )

    try:
        while True:
            _ = await websocket.receive_json()
    except WebSocketDisconnect:
        room_connection_manager.disconnect(room_id, websocket)
        await room_connection_manager.broadcast(
            room_id,
            {
                "type": "system",
                "payload": {"text": f"{participant_id} 已离开房间。"},
            },
        )
