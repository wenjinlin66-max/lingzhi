from fastapi import APIRouter

from backend.app.schemas.image import ImageGenerateRequest, ImageGenerateResponse
from backend.app.services.image_client import generate_image

router = APIRouter()


@router.post("/image/generate", response_model=ImageGenerateResponse)
async def create_image(payload: ImageGenerateRequest) -> ImageGenerateResponse:
    return await generate_image(payload)
