from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.core.db import get_db
from backend.app.models.item import Item
from backend.app.schemas.item import ItemCreate, ItemListResponse, ItemRead

router = APIRouter()


@router.get("/items", response_model=ItemListResponse)
def list_items(db: Annotated[Session, Depends(get_db)]) -> ItemListResponse:
    statement = select(Item).order_by(Item.created_at.desc())
    items = db.execute(statement).scalars().all()
    return ItemListResponse(items=[ItemRead.model_validate(item) for item in items])


@router.post("/items", response_model=ItemRead, status_code=status.HTTP_201_CREATED)
def create_item(payload: ItemCreate, db: Annotated[Session, Depends(get_db)]) -> ItemRead:
    item = Item(
        title=payload.title,
        description=payload.description,
        status=payload.status,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return ItemRead.model_validate(item)
