from pydantic import BaseModel, Field

from backend.app.schemas.emotion import EmotionAnalyzeResponse


class MatchRequest(BaseModel):
    session_token: str = Field(min_length=1, max_length=64)
    analysis: EmotionAnalyzeResponse


class MatchRoomSuggestion(BaseModel):
    room_id: str
    vibe_key: str
    vibe_label: str
    room_title: str
    strategy_key: str
    strategy_label: str
    participant_count: int
    connection_state: str
    icebreakers: list[str]


class MatchStrategyGroup(BaseModel):
    strategy_key: str
    strategy_label: str
    description: str
    rooms: list[MatchRoomSuggestion]




class MatchResponse(BaseModel):
    nickname: str
    avatar_color: str
    recommended_strategy: str
    strategies: list[MatchStrategyGroup]
