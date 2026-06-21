from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.core.db import get_db
from backend.app.schemas.matching import MatchRequest, MatchResponse
from backend.app.services.matching_service import match_room

router = APIRouter()


@router.post("/match", response_model=MatchResponse)
def match_emotion_room(payload: MatchRequest, db: Annotated[Session, Depends(get_db)]) -> MatchResponse:
    return match_room(payload, db)
