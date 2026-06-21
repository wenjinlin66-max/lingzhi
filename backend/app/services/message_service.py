from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.session import Session as ChatSession
from backend.app.schemas.message import MessageListResponse, MessageRead, MessageSendRequest

MESSAGE_STORE: dict[str, list[MessageRead]] = {}


def list_room_messages(room_id: str) -> MessageListResponse:
    room_messages = sorted(MESSAGE_STORE.get(room_id, []), key=lambda message: message.created_at)
    return MessageListResponse(messages=room_messages)


def create_room_message(room_id: str, payload: MessageSendRequest, db: Session) -> MessageRead:
    room_messages = MESSAGE_STORE.setdefault(room_id, [])
    session = db.execute(
        select(ChatSession).where(ChatSession.session_token == payload.session_token)
    ).scalar_one_or_none()

    if session is None:
        session = ChatSession(
            session_token=payload.session_token,
            nickname="匿名旅人",
            avatar_color="mixed",
        )
        db.add(session)
        db.commit()

    message = MessageRead(
        id=len(room_messages) + 1,
        room_id=room_id,
        nickname=session.nickname,
        avatar_color=session.avatar_color,
        message_type="chat_message",
        content=payload.content,
        created_at=datetime.now(timezone.utc),
    )
    room_messages.append(message)
    return message
