from datetime import datetime
from typing import Literal
from typing import ClassVar

from pydantic import BaseModel, ConfigDict, Field

ItemStatus = Literal["draft", "active", "archived"]


class ItemCreate(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    description: str = Field(default="", max_length=2000)
    status: ItemStatus = "draft"


class ItemRead(BaseModel):
    id: int
    title: str
    description: str
    status: ItemStatus
    created_at: datetime

    model_config: ClassVar[ConfigDict] = ConfigDict(from_attributes=True)


class ItemListResponse(BaseModel):
    items: list[ItemRead]
