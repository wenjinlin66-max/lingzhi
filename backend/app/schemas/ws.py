from pydantic import BaseModel


class WebSocketEvent(BaseModel):
    type: str
    payload: dict[str, object]
