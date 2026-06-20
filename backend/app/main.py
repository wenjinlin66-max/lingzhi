from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api import health, image, items, meta
from backend.app.core.config import settings
from backend.app.core.db import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    if getattr(app.state, "run_db_init", True):
        init_db()
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
)

app.state.run_db_init = True

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(meta.router, prefix="/api", tags=["meta"])
app.include_router(items.router, prefix="/api", tags=["items"])
app.include_router(image.router, prefix="/api", tags=["image"])
