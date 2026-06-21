from pydantic import BaseModel, Field


class EmotionAnalyzeRequest(BaseModel):
    text: str = Field(min_length=1, max_length=4000)
    session_token: str | None = Field(default=None, max_length=64)


class EmotionAnalyzeResponse(BaseModel):
    primary_emotion: str
    secondary_emotion: str
    valence: float
    arousal: float
    intensity: int
    keywords: list[str]
    summary: str
    provider: str
