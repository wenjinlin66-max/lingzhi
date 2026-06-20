from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from backend.app.core.config import settings
from backend.app.core.db import get_db

router = APIRouter()


@router.get("/meta")
def get_meta(db: Annotated[Session, Depends(get_db)]) -> dict[str, str | bool]:
    database_connected = False

    try:
        _ = db.execute(text("SELECT 1"))
        database_connected = True
    except Exception:
        database_connected = False

    return {
        "appName": settings.app_name,
        "environment": settings.app_env,
        "version": settings.app_version,
        "databaseConnected": database_connected,
    }
