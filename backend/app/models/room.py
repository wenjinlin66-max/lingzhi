from datetime import datetime, timezone
from typing import ClassVar

from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.core.db_base import Base


class Room(Base):
    __tablename__: ClassVar[str] = "rooms"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    room_code: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, index=True)
    vibe_key: Mapped[str] = mapped_column(String(32), nullable=False)
    vibe_label: Mapped[str] = mapped_column(String(120), nullable=False)
    emotion_bucket: Mapped[str] = mapped_column(String(32), nullable=False)
    intensity_bucket: Mapped[str] = mapped_column(String(32), nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="waiting")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
