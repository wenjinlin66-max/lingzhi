from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api import analyze, health, matching, messages, meta, rooms, ws
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

# 💡 优化：构建一个宽容的本地跨域开发列表
# 兼容前端通过 localhost 或 127.0.0.1 访问，避免浏览器因安全同源策略引发 Failed to fetch 拦截
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# 如果配置文件里定义了额外的源，也加进来
if settings.frontend_origin:
    origins.append(settings.frontend_origin)

# 对列表进行去重处理
origins = list(set(origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 👈 传入优化后的跨域允许源列表
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(meta.router, prefix="/api", tags=["meta"])
app.include_router(analyze.router, prefix="/api", tags=["analyze"])
app.include_router(matching.router, prefix="/api", tags=["matching"])
app.include_router(rooms.router, prefix="/api", tags=["rooms"])
app.include_router(messages.router, prefix="/api", tags=["messages"])
app.include_router(ws.router, prefix="/api", tags=["ws"])
