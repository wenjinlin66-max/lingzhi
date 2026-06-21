from fastapi import APIRouter

from backend.app.schemas.emotion import EmotionAnalyzeRequest, EmotionAnalyzeResponse
from backend.app.services.analyze_service import analyze_text

router = APIRouter()


@router.post("/analyze", response_model=EmotionAnalyzeResponse)
async def analyze_emotion(payload: EmotionAnalyzeRequest) -> EmotionAnalyzeResponse:
    return await analyze_text(payload)
