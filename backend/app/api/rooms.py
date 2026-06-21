from fastapi import APIRouter

from backend.app.schemas.room import RoomStateResponse
from backend.app.services.room_service import get_room_state

router = APIRouter()


@router.get("/rooms/{room_id}", response_model=RoomStateResponse)
def read_room_state(room_id: str) -> RoomStateResponse:
    return get_room_state(room_id)
