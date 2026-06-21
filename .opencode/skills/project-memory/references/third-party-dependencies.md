# 第三方依赖

## 后端依赖（真实）

- FastAPI - Web 框架
- Uvicorn - ASGI 服务运行
- SQLAlchemy - ORM 与数据库访问
- psycopg - PostgreSQL 驱动
- pydantic-settings - 配置管理
- httpx - 外部 HTTP 请求
- openai - OpenAI 兼容接口客户端
- anthropic - Anthropic 客户端
- pytest - 后端测试框架

## 前端依赖（真实）

- Next.js 14 - 前端框架与构建运行时
- React 18 - UI 运行时
- TypeScript - 类型系统
- `motion/react` - 页面动效与微交互（当前首页/卡片已使用）

## 数据库与运行时

- PostgreSQL 17 - 关系型数据库
- Docker Compose - 本地服务编排

## LLM / 外部服务

- OpenAI 兼容接口（当前默认通过老张 API 接入）
- Anthropic 标准接口
- mock provider（演示兜底）

## 当前已移出主链路的依赖方向

- 图片生成接口文件仍保留在代码里，但当前主应用不再注册对应路由
- 因此图像生成依赖不应再被写成当前主链路能力

## 维护原则

- 只记录真实参与当前项目的关键依赖
- 若某依赖只保留历史文件但不再挂载主链路，应显式标记
- 当默认 LLM 来源或前端关键依赖变化时，必须同步更新本文件
