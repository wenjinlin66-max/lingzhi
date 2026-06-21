from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import Session, sessionmaker

from backend.app.core.config import settings
from backend.app.core.db import Base, get_db
from backend.app.main import app
from backend.app.models.emotion_analysis import EmotionAnalysis
from backend.app.models.message import Message
from backend.app.models.room import Room
from backend.app.models.session import Session as ChatSession

TEST_DATABASE_URL = "sqlite://"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


@pytest.fixture()
def db_session() -> Generator[Session, None, None]:
    _ = EmotionAnalysis
    _ = Message
    _ = Room
    _ = ChatSession
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()

    yield session

    session.close()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client(db_session: Session) -> Generator[TestClient, None, None]:
    def override_get_db() -> Generator[Session, None, None]:
        yield db_session

    original_llm_provider = settings.llm_provider
    app.dependency_overrides[get_db] = override_get_db
    app.state.run_db_init = False
    settings.llm_provider = "mock"

    with TestClient(app) as test_client:
        yield test_client

    settings.llm_provider = original_llm_provider
    app.state.run_db_init = True
    app.dependency_overrides.clear()
