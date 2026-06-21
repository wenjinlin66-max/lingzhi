from backend.app.schemas.emotion import EmotionAnalyzeRequest, EmotionAnalyzeResponse
from backend.app.services.providers.base import LLMProvider


class MockProvider(LLMProvider):
    async def analyze_emotion(self, payload: EmotionAnalyzeRequest) -> EmotionAnalyzeResponse:
        text = payload.text
        lowered = text.lower()

        if any(keyword in lowered for keyword in ["累", "焦虑", "压力", "stress", "anxious"]):
            return EmotionAnalyzeResponse(
                primary_emotion="anxious",
                secondary_emotion="lonely",
                valence=-0.7,
                arousal=0.8,
                intensity=4,
                keywords=["压力", "疲惫", "无人理解"],
                summary="你正在经历高唤醒的焦虑，同时带有一点无人理解的孤独感。",
                provider="mock",
            )

        if any(keyword in lowered for keyword in ["开心", "兴奋", "期待", "happy", "excited"]):
            return EmotionAnalyzeResponse(
                primary_emotion="happy",
                secondary_emotion="calm",
                valence=0.8,
                arousal=0.7,
                intensity=4,
                keywords=["期待", "能量", "分享"],
                summary="你当前情绪整体偏积极，带有明显的分享欲和轻快感。",
                provider="mock",
            )

        if any(keyword in lowered for keyword in ["难过", "失落", "孤独", "sad", "lonely"]):
            return EmotionAnalyzeResponse(
                primary_emotion="lonely",
                secondary_emotion="sad",
                valence=-0.6,
                arousal=0.4,
                intensity=3,
                keywords=["失落", "安静", "需要陪伴"],
                summary="你更像是在经历一种安静的失落，同时希望被人陪伴或理解。",
                provider="mock",
            )

        return EmotionAnalyzeResponse(
            primary_emotion="mixed",
            secondary_emotion="calm",
            valence=0.0,
            arousal=0.5,
            intensity=3,
            keywords=["复杂", "状态波动", "想表达"],
            summary="你的情绪并不单一，更像是带有多种感受的混合状态。",
            provider="mock",
        )
