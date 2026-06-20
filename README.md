# lingzhi

一个为比赛前准备的全栈通用底座：

- 后端：FastAPI
- 前端：Vue 3 + Vite
- 数据库：PostgreSQL
- 容器：Docker Compose

这个仓库刻意保持“题目无关”的通用结构，方便你在真正比赛题目公布后，快速把 `Item`、页面文案和字段替换成新业务。

默认数据库方案是：**使用 Docker 启动 PostgreSQL**，并把宿主机端口映射到 `5433`，尽量避开你电脑里已经存在的本地 PostgreSQL/pgvector 冲突。

## 目录结构

```text
.
├─ backend/     FastAPI + SQLAlchemy 后端
├─ frontend/    Vue 3 + Vite 前端
├─ docker-compose.yml
└─ .env.example
```

## 快速开始

### 1. 启动 PostgreSQL

先复制环境变量：

```bash
copy .env.example .env
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

然后只启动 Docker 里的 PostgreSQL：

```bash
docker compose up -d db
```

### 2. 启动后端

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
set PYTHONPATH=..
uvicorn backend.app.main:app --reload
```

后端默认地址：`http://localhost:8000`

后端默认连接的数据库地址是：`postgresql+psycopg://postgres:postgres@localhost:5433/lingzhi_app`

### 3. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端默认地址：`http://localhost:5173`

### 4. 完整容器方式启动（可演示）

如果你想一次把数据库、后端、前端都拉起来，请在**仓库根目录**执行：

```bash
docker compose up --build
```

其中：

- PostgreSQL：`localhost:5433`
- FastAPI：`http://localhost:8000`
- Vue：`http://localhost:5173`

> 推荐你平时开发时优先用“数据库走 Docker、前后端走本机”的方式，排错更直接；演示或交付时再使用 `docker compose up --build` 全量拉起。

## 默认接口

- `GET /api/health`：服务健康检查
- `GET /api/meta`：返回应用和数据库状态
- `GET /api/items`：查询 starter 数据
- `POST /api/items`：新增 starter 数据
- `POST /api/image/generate`：代理调用生图模型（API Key 仅保存在 `backend/.env`）

## 生图模型预留配置

如果你后面要接入字节/火山引擎这类生图模型，现在已经预留了后端代理接口。你只需要在 `backend/.env` 中填写：

```env
IMAGE_API_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
IMAGE_API_KEY=你的真实密钥
IMAGE_MODEL=doubao-seedream-5-0-260128
IMAGE_DEFAULT_SIZE=2K
IMAGE_WATERMARK=true
```

然后调用：

```http
POST /api/image/generate
```

请求体示例：

```json
{
  "prompt": "A cinematic fantasy scene with layered lighting.",
  "size": "2K",
  "watermark": true
}
```

这样做的好处是：前端永远不直接暴露第三方生图 Key，后续你只需要改页面和 prompt 生成逻辑。

## 比赛时如何快速改造

最常见的做法是：

1. 把 `Item` 改成比赛题目的核心实体
2. 给 `Item` 增减字段
3. 调整前端表单和列表页面
4. 替换首页文案、配色和展示逻辑
5. 继续复用现成的数据库连接、接口组织和状态页

## 当前底座特性

这个 starter 现在是完全通用的，不绑定任何旧赛题，默认包含：

- Docker PostgreSQL 数据持久化
- FastAPI 后端健康检查 / 元信息 / starter CRUD
- Vue 前端状态面板与 starter item 录入
- 前后端环境变量分离
- 可直接继续扩展成任意比赛题目的业务模型

## 连接 GitHub

如果本地还没初始化仓库，可以执行：

```bash
git init
git branch -M main
git remote add origin https://github.com/wenjinlin66-max/lingzhi.git
git add .
git commit -m "chore: scaffold competition starter"
git push -u origin main
```

如果已经初始化过仓库，只需要补 remote 并 push。
