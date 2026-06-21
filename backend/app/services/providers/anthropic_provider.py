import json

from anthropic import AsyncAnthropic

from backend.app.core.config import settings
from backend.app.schemas.emotion import EmotionAnalyzeRequest, EmotionAnalyzeResponse
from backend.app.services.providers.base import LLMProvider


class AnthropicProvider(LLMProvider):
    def __init__(self) -> None:
        self.client = AsyncAnthropic(api_key=settings.anthropic_api_key)

    async def analyze_emotion(self, payload: EmotionAnalyzeRequest) -> EmotionAnalyzeResponse:
        prompt = (
            "你是一个情绪分析器。请仅返回 JSON，包含字段："
            "primary_emotion, secondary_emotion, valence, arousal, intensity, keywords, summary。"
        )
        response = await self.client.messages.create(
            model=settings.anthropic_model,
            max_tokens=512,
            system=prompt,
            messages=[{"role": "user", "content": payload.text}],
        )
        content = response.content[0].text
        return EmotionAnalyzeResponse.model_validate(json.loads(content))
