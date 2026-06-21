from datetime import datetime, timezone
from typing import ClassVar

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.core.db_base import Base


class EmotionAnalysis(Base):
    __tablename__: ClassVar[str] = "emotion_analyses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("sessions.id"), nullable=False, index=True)
    source_text: Mapped[str] = mapped_column(Text, nullable=False)
    primary_emotion: Mapped[str] = mapped_column(String(32), nullable=False)
    secondary_emotion: Mapped[str] = mapped_column(String(32), nullable=False, default="mixed")
    valence: Mapped[float] = mapped_column(Float, nullable=False)
    arousal: Mapped[float] = mapped_column(Float, nullable=False)
    intensity: Mapped[int] = mapped_column(Integer, nullable=False)
    keywords_json: Mapped[str] = mapped_column(Text, nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    provider: Mapped[str] = mapped_column(String(32), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
