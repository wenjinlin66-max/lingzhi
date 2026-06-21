# 代码结构

## 仓库总览

### 根目录

- `backend/` - FastAPI 后端
- `frontend/` - Next.js 前端
- `docker-compose.yml` - 本地服务编排
- `.opencode/skills/` - repo-local skill 与项目记忆

## 后端实际结构

### 应用入口与基础层

- `backend/app/main.py` - FastAPI 应用入口与当前真实路由注册
- `backend/app/core/config.py` - 环境变量与配置
- `backend/app/core/db.py` - 引擎、Session、建表初始化
- `backend/app/core/db_base.py` - SQLAlchemy Base

### API 层（真实挂载）

- `backend/app/api/health.py` - 健康检查
- `backend/app/api/meta.py` - 元信息与数据库连接状态
- `backend/app/api/analyze.py` - 情绪分析
- `backend/app/api/matching.py` - 房间匹配
- `backend/app/api/rooms.py` - 房间状态读取
- `backend/app/api/messages.py` - 历史消息 / 发消息
- `backend/app/api/ws.py` - 房间 WebSocket

### API 层（存在但未挂载到主应用）

- `backend/app/api/image.py` - 历史遗留图片生成接口文件，当前主应用不再注册

### 模型层

- `backend/app/models/session.py` - 匿名会话模型（当前运行时真实使用）
- `backend/app/models/emotion_analysis.py` - 情绪分析记录模型（当前未在 analyze service 中真实落库）
- `backend/app/models/room.py` - 房间模型（当前未作为 room service 数据源）
- `backend/app/models/message.py` - 消息模型（当前未作为 message service 数据源）

### Schema 层

- `backend/app/schemas/emotion.py` - 情绪分析输入/输出
- `backend/app/schemas/matching.py` - 当前真实匹配契约：`recommended_strategy + strategies[]`
- `backend/app/schemas/room.py` - 房间状态结构
- `backend/app/schemas/message.py` - 消息结构
- `backend/app/schemas/ws.py` - WebSocket 事件结构（存在，但当前主要使用原始 JSON 广播）

### 服务层

- `backend/app/services/analyze_service.py` - 分析服务，委托 provider
- `backend/app/services/matching_service.py` - 规则化策略房间建议生成
- `backend/app/services/room_service.py` - 由 room_id 推导房间状态
- `backend/app/services/message_service.py` - 内存消息读写 + session 匿名身份恢复
- `backend/app/services/realtime_service.py` - 进程内房间连接管理
- `backend/app/services/nickname_service.py` - 昵称生成
- `backend/app/services/icebreaker_service.py` - 破冰建议
- `backend/app/services/providers/` - OpenAI 兼容 / Anthropic / mock provider
- `backend/app/services/image_client.py` - 历史遗留图片生成客户端，当前不属于主链路

### 测试层

- `backend/tests/conftest.py`
- `backend/tests/test_health.py`
- `backend/tests/test_meta_api.py`
- `backend/tests/test_analyze_api.py`
- `backend/tests/test_matching_api.py` - 当前包含超前契约断言，需要后续收敛
- `backend/tests/test_messages_api.py`

## 前端实际结构

### 路由页层

- `frontend/app/layout.tsx` - 全局布局
- `frontend/app/page.tsx` - 首页
- `frontend/app/analyze/page.tsx` - 分析页入口
- `frontend/app/match/page.tsx` - 历史遗留匹配路由，当前仅重定向到 `/analyze`
- `frontend/app/room/[roomId]/page.tsx` - 房间页入口
- `frontend/app/globals.css` - 全局样式

### 功能层

- `frontend/features/analyze/HomeEmotionForm.tsx` - 当前首页真实输入组件
- `frontend/features/analyze/AnalyzeResultFlow.tsx` - 当前分析 + 匹配整合主流程
- `frontend/features/analyze/HomeEmotionEntry.tsx` - 当前遗留/未使用组件
- `frontend/features/chat/RoomChatFlow.tsx` - 当前房间聊天主流程

### 组件层

- `frontend/components/layout/AppShell.tsx` - 页面壳
- `frontend/components/layout/AmbientBackground.tsx` - 背景变体
- `frontend/components/emotion/EmotionSummaryCard.tsx` - 情绪分析卡
- `frontend/components/common/SectionCard.tsx`
- `frontend/components/common/StatusCard.tsx`
- `frontend/components/common/EmptyState.tsx`
- `frontend/components/motion/MotionFloat.tsx`
- `frontend/components/motion/MotionReveal.tsx`

### 基础层

- `frontend/lib/api.ts` - HTTP API 封装
- `frontend/lib/ws.ts` - WebSocket URL 生成
- `frontend/lib/storage.ts` - localStorage 持久化
- `frontend/lib/types.ts` - 前端共享类型（当前有少量超前字段）
- `frontend/lib/theme.ts` - 情绪标签、颜色、动态文案

## 当前真实主流程链路

### 路径链路

- `/` -> `/analyze` -> `/room/[roomId]`

### 说明

- `/match` 当前不再是独立流程页
- 分析与匹配已经合并到 `AnalyzeResultFlow.tsx`
- 房间页独立承担聊天职责

## 当前已知结构性问题

- `AnalyzeResultFlow.tsx` 是当前关键文件，一旦丢失会直接导致 `/analyze` 页面失效
- `HomeEmotionEntry.tsx` 是未接入 live route 的遗留组件
- `frontend/lib/types.ts` 与 `backend/app/schemas/matching.py` 当前不完全一致
- `backend/tests/test_matching_api.py` 与后端真实匹配 schema 不完全一致

## 维护原则

- 这个文件必须描述“真实在跑的结构”，不是理想模块图
- 遗留文件必须显式标注，不可与 live path 混淆
- 一旦前端主流程改路由，必须同步更新这里
