from datetime import datetime

from pydantic import BaseModel, Field


class MessageSendRequest(BaseModel):
    session_token: str = Field(min_length=1, max_length=64)
    content: str = Field(min_length=1, max_length=2000)


class MessageRead(BaseModel):
    id: int
    room_id: str
    nickname: str
    avatar_color: str
    message_type: str
    content: str
    created_at: datetime


class MessageListResponse(BaseModel):
    messages: list[MessageRead]
