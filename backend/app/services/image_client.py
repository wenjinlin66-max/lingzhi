import httpx
from fastapi import HTTPException, status

from backend.app.core.config import settings
from backend.app.schemas.image import ImageGenerateRequest, ImageGenerateResponse


async def generate_image(payload: ImageGenerateRequest) -> ImageGenerateResponse:
    if not settings.image_api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="IMAGE_API_KEY is not configured in backend/.env.",
        )

    request_payload = {
        "model": settings.image_model,
        "prompt": payload.prompt,
        "sequential_image_generation": payload.sequential_image_generation,
        "response_format": payload.response_format,
        "size": payload.size or settings.image_default_size,
        "stream": payload.stream,
        "watermark": settings.image_watermark if payload.watermark is None else payload.watermark,
    }

    endpoint = f"{settings.image_api_base_url.rstrip('/')}/images/generations"

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                endpoint,
                headers={
                    "Authorization": f"Bearer {settings.image_api_key}",
                    "Content-Type": "application/json",
                },
                json=request_payload,
            )
    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Image provider request failed: {exc}",
        ) from exc

    if response.status_code >= 400:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail={
                "message": "Image provider returned an error.",
                "status_code": response.status_code,
                "body": response.text,
            },
        )

    return ImageGenerateResponse(
        request_model=settings.image_model,
        upstream_response=response.json(),
    )
