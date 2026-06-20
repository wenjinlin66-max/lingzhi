from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def get_health() -> dict[str, bool]:
    return {"ok": True}
