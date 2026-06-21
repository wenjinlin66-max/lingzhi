# 部分到部分契约 v1

## 文件用途

记录当前不同系统部分之间真实如何交换数据、上下文与责任。

## 当前边界（真实）

### 前端 <-> 后端（HTTP）

- 前端通过 `frontend/lib/api.ts` 调用后端 API
- 当前主调用顺序：
  1. `analyzeEmotion`
  2. `matchRoom`
  3. `getRoomState`
  4. `getRoomMessages`
  5. `sendRoomMessage`
- 后端返回结构化 JSON，由前端本地状态和 localStorage 消费

### 前端 <-> 后端（WebSocket）

- 前端在进入房间页后建立 `WS /api/rooms/{room_id}/ws`
- WebSocket 当前承担：
  - 进入/离开房间系统提示
  - 接收后端广播的标准聊天消息
- 当前真实消息写入不是 WebSocket 直写，而是：
  - HTTP 发消息
  - 后端生成标准消息
  - 后端再通过 WebSocket 广播

### 前端 <-> localStorage

- 当前前端状态连续性依赖 localStorage
- 关键键：
  - `vibechat-session-token`
  - `vibechat-draft`
- `draft` 当前承载：
  - `text`
  - `analysis`
  - `match`
  - `selectedRoom`

### 后端 <-> PostgreSQL

- 后端负责 SQLAlchemy Session 生命周期
- 当前数据库模型已创建：
  - `sessions`
  - `emotion_analyses`
  - `rooms`
  - `messages`
- 但当前真实运行时主要只在匹配/聊天中使用 `sessions`
- `rooms/messages/emotion_analyses` 仍未完全成为运行时真实数据源

### 后端 <-> 外部 LLM

- 后端通过统一 provider 抽象调用外部模型
- 当前支持：
  - OpenAI 兼容接口（默认老张 API）
  - Anthropic
  - mock
- `analyze_service` 只负责调用 provider，不负责存储分析结果

## 当前责任拆分

### 首页输入责任

- 前端负责：
  - 输入校验
  - 保存 draft.text
  - 跳转到 `/analyze`
- 后端不参与首页输入态

### 分析页责任

- 前端负责：
  - 读 draft
  - 发起情绪分析
  - 发起匹配
  - 渲染情绪卡与策略房间建议
- 后端负责：
  - 返回结构化分析结果
  - 返回策略化房间建议

### 房间页责任

- 前端负责：
  - 房间状态展示
  - 历史消息展示
  - 发送消息输入
  - WebSocket 状态感知
- 后端负责：
  - 标准消息结构生成
  - 匿名身份恢复
  - 当前连接人数统计
  - 广播系统消息与聊天消息

## 当前关键不一致点

- 前端类型中部分匹配字段超前于后端真实实现
- 测试里部分 surface / suggestions 契约也超前于后端真实实现
- `/match` 路由仍存在，但不再承担独立流程角色

## 后续待定问题

- 是否引入真正的 rooms/people 双 surface 契约？
- 是否把 messages / rooms / emotion_analyses 的运行时读写落回数据库？
- 是否新增房间创建 / 查找房间独立接口？
