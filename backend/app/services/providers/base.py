from abc import ABC, abstractmethod

from backend.app.schemas.emotion import EmotionAnalyzeRequest, EmotionAnalyzeResponse


class LLMProvider(ABC):
    @abstractmethod
    async def analyze_emotion(self, payload: EmotionAnalyzeRequest) -> EmotionAnalyzeResponse:
        raise NotImplementedError
