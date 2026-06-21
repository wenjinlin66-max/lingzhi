from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from backend.app.core.config import settings
from backend.app.core.db_base import Base

engine = create_engine(settings.database_url, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    from backend.app.models import emotion_analysis as emotion_analysis_models
    from backend.app.models import message as message_models
    from backend.app.models import room as room_models
    from backend.app.models import session as session_models

    _ = emotion_analysis_models
    _ = message_models
    _ = room_models
    _ = session_models
    Base.metadata.create_all(bind=engine)
