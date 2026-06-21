import json

from openai import AsyncOpenAI
from pydantic import ValidationError

from backend.app.core.config import settings
from backend.app.schemas.emotion import EmotionAnalyzeRequest, EmotionAnalyzeResponse
from backend.app.services.providers.base import LLMProvider


class OpenAIProvider(LLMProvider):
    def __init__(self) -> None:
        self.client = AsyncOpenAI(api_key=settings.openai_api_key, base_url=settings.openai_base_url)

    async def analyze_emotion(self, payload: EmotionAnalyzeRequest) -> EmotionAnalyzeResponse:
        system_prompt = (
            "你是一个情绪分析器。"
            "请基于用户输入输出严格 JSON，不要输出 Markdown，不要输出额外解释。"
            "JSON 必须包含字段：primary_emotion, secondary_emotion, valence, arousal, intensity, keywords, summary。"
            "约束："
            "primary_emotion 和 secondary_emotion 使用简短英文单词；"
            "valence 范围 -1 到 1；"
            "arousal 范围 0 到 1；"
            "intensity 为 1 到 5 的整数；"
            "keywords 为 2 到 4 个中文关键词；"
            "summary 为一句中文总结。"
        )
        response = await self.client.chat.completions.create(
            model=settings.openai_model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": payload.text},
            ],
            temperature=0.3,
            max_tokens=300,
            response_format={"type": "json_object"},
        )

        content = response.choices[0].message.content or ""

        try:
            payload_data = json.loads(content)
            if not isinstance(payload_data, dict):
                raise ValueError("Emotion payload is not a JSON object.")
            payload_data["provider"] = "openai"
            analysis = EmotionAnalyzeResponse.model_validate(payload_data)
        except ValidationError as exc:
            raise ValueError(f"OpenAI-compatible provider returned invalid emotion JSON: {content}") from exc
        except json.JSONDecodeError as exc:
            raise ValueError(f"OpenAI-compatible provider returned non-JSON content: {content}") from exc

        return analysis
