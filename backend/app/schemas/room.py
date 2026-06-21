from pydantic import BaseModel


class RoomStateResponse(BaseModel):
    room_id: str
    vibe_key: str
    vibe_label: str
    emotion_bucket: str
    intensity_bucket: str
    participant_count: int
    status: str
