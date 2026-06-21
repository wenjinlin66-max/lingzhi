from collections import defaultdict

from fastapi import WebSocket


class RoomConnectionManager:
    def __init__(self) -> None:
        self.rooms: dict[str, list[WebSocket]] = defaultdict(list)

    async def connect(self, room_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self.rooms[room_id].append(websocket)

    def disconnect(self, room_id: str, websocket: WebSocket) -> None:
        room_connections = self.rooms.get(room_id, [])
        if websocket in room_connections:
            room_connections.remove(websocket)
        if not room_connections and room_id in self.rooms:
            del self.rooms[room_id]

    async def broadcast(self, room_id: str, message: dict[str, object]) -> None:
        for connection in self.rooms.get(room_id, []):
            await connection.send_json(message)

    def participant_count(self, room_id: str) -> int:
        return len(self.rooms.get(room_id, []))


room_connection_manager = RoomConnectionManager()
