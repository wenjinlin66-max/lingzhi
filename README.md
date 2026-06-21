# VibeChat

AI 驱动的情绪社交 Web 应用。用户输入一段当前状态，系统分析情绪后，将其送入同频匿名房间，并进入一段轻量匿名对话。

## 当前技术栈

- 后端：FastAPI
- 前端：Next.js 14
- 数据库：PostgreSQL
- 本地数据库运行方式：Docker Compose
- LLM 适配：OpenAI 兼容接口 / Anthropic / mock

## 当前产品主链路

1. 用户输入一句当前心情或状态
2. 后端调用 LLM 分析情绪
3. 系统将用户分配到同频情绪房间
4. 用户以匿名昵称进入房间聊天
5. 若房间暂时无人，也能通过破冰提示与单人等待模式稳定演示

## 目录结构

```text
.
├─ backend/     FastAPI 后端
├─ frontend/    Next.js 前端
├─ docker-compose.yml
└─ .env.example
```

## 快速开始

### 1. 复制环境变量

```bash
copy .env.example .env
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

### 2. 启动 PostgreSQL

```bash
docker compose up -d db
```

默认使用宿主机端口 `5433`，尽量避开本机已有 PostgreSQL 冲突。

### 3. 启动后端

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
set PYTHONPATH=..
python -m uvicorn backend.app.main:app --reload
```

后端地址：`http://localhost:8000`

### 4. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端地址：`http://localhost:3000`

### 5. 一次性容器启动（可选）

```bash
docker compose up --build
```

服务地址：

- PostgreSQL：`localhost:5433`
- FastAPI：`http://localhost:8000`
- Next.js：`http://localhost:3000`

## 当前后端接口

### 基础接口

- `GET /api/health`：健康检查
- `GET /api/meta`：应用与数据库状态

### VibeChat 主链路接口

- `POST /api/analyze`：分析情绪
- `POST /api/match`：分配同频房间
- `GET /api/rooms/{room_id}`：获取房间状态
- `GET /api/rooms/{room_id}/messages`：获取房间历史消息
- `POST /api/rooms/{room_id}/messages`：发送消息
- `WS /api/rooms/{room_id}/ws`：房间实时消息

## LLM 配置方式

### 统一切换变量

在 `backend/.env` 中使用：

```env
LLM_PROVIDER=openai
```

可选值：

- `openai`
- `anthropic`
- `mock`

### OpenAI 兼容接口模式（当前默认接老张 API）

```env
LLM_PROVIDER=openai
OPENAI_API_KEY=你的老张 API Key
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.laozhang.ai/v1
```

说明：

- 当前项目默认通过 `openai` provider 接入 **OpenAI 兼容协议**
- 你现在可直接使用老张 API 提供的 `gpt-4o-mini`
- 如果后续要切回官方 OpenAI，只需要把 `OPENAI_BASE_URL` 改回 `https://api.openai.com/v1`

### Anthropic 标准接口模式

```env
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=你的 Anthropic Key
ANTHROPIC_MODEL=claude-3-5-sonnet-latest
```

### Mock 兜底模式（推荐演示备用）

```env
LLM_PROVIDER=mock
```

特点：

- 不依赖外部 API
- 可稳定输出结构化情绪结果
- 适合作为现场降级演示模式

## 前端环境变量

在 `frontend/.env` 中配置：

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## 当前演示兜底策略

聊天是最容易翻车的部分，所以当前版本预设了三层兜底：

1. **单开两个浏览器窗口**，模拟两个匿名用户
2. **房间允许单人进入**，即使暂无匹配对象也能继续体验
3. **AI 破冰建议** 在无人进入时仍能支撑聊天页氛围

注意：

- AI 破冰建议只是暖场和兜底，不替代匿名社交主体验
- 如果外部 LLM 出错，建议切到 `mock` 模式继续演示

## 当前 LLM 默认值

后端当前已经切到：

```env
LLM_PROVIDER=openai
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.laozhang.ai/v1
```

图片生成功能已从主应用入口移除，不再属于当前比赛项目主链路。

## 当前比赛策略

- 对外讲“相似度驱动匹配”
- 对内第一版先实现“房间制情绪匹配”
- 优先保证：能运行、能演示、能讲清楚
- 优先完成：情绪输入 → 情绪分析 → 房间匹配 → 匿名聊天闭环

## 提交材料提醒

比赛最终提交时至少需要：

1. GitHub 仓库链接
2. 3～6 分钟完整演示视频
3. 100 字以内产品介绍
4. 线上演示地址
