from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.core.db import get_db
from backend.app.schemas.message import MessageListResponse, MessageRead, MessageSendRequest
from backend.app.services.message_service import create_room_message, list_room_messages
from backend.app.services.realtime_service import room_connection_manager

router = APIRouter()


@router.get("/rooms/{room_id}/messages", response_model=MessageListResponse)
def read_room_messages(room_id: str) -> MessageListResponse:
    return list_room_messages(room_id)


@router.post("/rooms/{room_id}/messages", response_model=MessageRead)
async def send_room_message(room_id: str, payload: MessageSendRequest, db: Annotated[Session, Depends(get_db)]) -> MessageRead:
    message = create_room_message(room_id, payload, db)
    await room_connection_manager.broadcast(
        room_id,
        {
            "type": "chat_message",
            "payload": message.model_dump(mode="json"),
        },
    )
    return message
