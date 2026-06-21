# 数据库设计

## 当前状态

- 数据库模型已经存在，但当前运行时只部分启用。
- 当前必须区分：
  - **模型层已存在什么**
  - **运行时真实在用什么**

## 当前持久化策略（真实）

- PostgreSQL 作为正式数据库配置保留
- 运行时当前真实持久化重点是：`sessions`
- `rooms/messages/emotion_analyses` 当前还没有完整接入真实读写主路径

## 当前核心表

### 1. sessions（真实使用中）

用途：

- 记录匿名用户会话
- 在匹配和发消息时恢复匿名身份

当前关键字段：

- `id`
- `session_token`
- `nickname`
- `avatar_color`
- `created_at`
- `last_seen_at`

当前运行时使用情况：

- 已真实用于：
  - `/api/match`
  - `/api/rooms/{room_id}/messages`

### 2. emotion_analyses（模型存在，当前未真实落库）

用途（设计目标）：

- 记录一次输入对应的结构化情绪分析结果

当前字段：

- `id`
- `session_id`
- `source_text`
- `primary_emotion`
- `secondary_emotion`
- `valence`
- `arousal`
- `intensity`
- `keywords_json`
- `summary`
- `provider`
- `created_at`

当前运行时状态：

- 模型已定义
- 当前 `analyze_service` 未把分析结果真实写入该表

### 3. rooms（模型存在，当前未成为真实房间数据源）

用途（设计目标）：

- 记录匿名情绪房间

当前字段：

- `id`
- `room_code`
- `vibe_key`
- `vibe_label`
- `emotion_bucket`
- `intensity_bucket`
- `status`
- `created_at`

当前运行时状态：

- 模型已定义
- 当前房间状态主要由 `room_id` 字符串 + websocket participant count 推导
- 当前推荐房间也主要是规则合成，不从该表查询

### 4. messages（模型存在，当前未作为真实消息存储）

用途（设计目标）：

- 记录房间消息

当前字段：

- `id`
- `room_id`
- `session_id`
- `message_type`
- `content`
- `created_at`

当前运行时状态：

- 模型已定义
- 当前消息主链路仍使用进程内 `MESSAGE_STORE`
- 服务重启后，消息历史不会自动从数据库恢复

## 当前设计原则

- 保留数据库模型，为后续真正持久化做准备
- 当前比赛阶段优先保证主链路可演示
- 真实运行时若未使用数据库，必须在文档中明确，不得误写成“已持久化”

## 当前已冻结的真实选择

- `sessions` 是当前唯一明确已真实参与主链路的数据库表
- 匿名身份与真实身份完全分离
- 分析、房间、消息的持久化目标已建模，但尚未完全实现

## 下一步数据库方向

1. 让 `emotion_analyses` 真正记录分析结果
2. 让 `rooms` 成为真实房间池来源
3. 让 `messages` 成为真实历史消息来源
4. 再决定是否加入更多统计/推荐相关表
