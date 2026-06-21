from backend.app.schemas.emotion import EmotionAnalyzeRequest, EmotionAnalyzeResponse
from backend.app.services.providers.factory import get_llm_provider


async def analyze_text(payload: EmotionAnalyzeRequest) -> EmotionAnalyzeResponse:
    provider = get_llm_provider()
    return await provider.analyze_emotion(payload)
