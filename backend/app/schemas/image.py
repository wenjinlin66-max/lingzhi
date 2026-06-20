from typing import Any

from pydantic import BaseModel, Field


class ImageGenerateRequest(BaseModel):
    prompt: str = Field(min_length=1, max_length=4000)
    size: str | None = Field(default=None, max_length=32)
    watermark: bool | None = None
    sequential_image_generation: str = Field(default="disabled", max_length=32)
    response_format: str = Field(default="url", max_length=32)
    stream: bool = False


class ImageGenerateResponse(BaseModel):
    request_model: str
    upstream_response: dict[str, Any]
