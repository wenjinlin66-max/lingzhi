# API 与事件契约

## 当前状态

- 当前文档以**真实实现**为准，不再以理想目标集为准。
- 后端当前真实公开接口集中在：分析、匹配、房间状态、消息、WebSocket。
- 当前没有 project-memory 同步后端接口，也没有房间创建 / 房间查找正式接口。

## 当前 HTTP API（真实）

### 1. 健康检查

- `GET /api/health`

### 2. 系统元信息

- `GET /api/meta`

### 3. 情绪分析

- `POST /api/analyze`

输入：

```json
{
  "text": "今天真的很累，有点焦虑。",
  "session_token": "session-uuid"
}
```

输出：

```json
{
  "primary_emotion": "anxious",
  "secondary_emotion": "lonely",
  "valence": -0.7,
  "arousal": 0.8,
  "intensity": 4,
  "keywords": ["压力", "疲惫"],
  "summary": "高唤醒焦虑",
  "provider": "mock | openai | anthropic"
}
```

说明：

- 当前分析结果不写入数据库，只作为运行时返回结果使用。

### 4. 房间匹配

- `POST /api/match`

输入：

```json
{
  "session_token": "session-uuid",
  "analysis": {
    "primary_emotion": "anxious",
    "secondary_emotion": "lonely",
    "valence": -0.7,
    "arousal": 0.8,
    "intensity": 4,
    "keywords": ["压力", "疲惫"],
    "summary": "高唤醒焦虑",
    "provider": "mock"
  }
}
```

输出（当前真实契约）：

```json
{
  "nickname": "雾岛邮差_65",
  "avatar_color": "anxious",
  "recommended_strategy": "similar",
  "strategies": [
    {
      "strategy_key": "similar",
      "strategy_label": "相似情绪",
      "description": "找到与你当前情绪最接近、最容易直接开口的匿名房间。",
      "rooms": [
        {
          "room_id": "anxious-mirror-4",
          "vibe_key": "anxious",
          "vibe_label": "深夜焦虑",
          "room_title": "深夜焦虑",
          "strategy_key": "similar",
          "strategy_label": "相似情绪",
          "participant_count": 2,
          "connection_state": "connected",
          "icebreakers": ["..."]
        }
      ]
    }
  ]
}
```

当前真实说明：

- `recommended_surface` **尚未实现**
- `surfaces` **尚未实现**
- 当前只有 `strategies -> rooms[]` 的一层推荐结构
- `participant_count` 与 `connection_state` 目前是规则生成值，不是数据库真实统计值

### 5. 房间状态

- `GET /api/rooms/{room_id}`

输出：

```json
{
  "room_id": "anxious-mirror-4",
  "vibe_key": "anxious",
  "vibe_label": "深夜焦虑",
  "emotion_bucket": "anxious",
  "intensity_bucket": "4",
  "participant_count": 1,
  "status": "waiting"
}
```

说明：

- 当前房间状态由 `room_id` 推导 + 运行中 WebSocket 人数决定
- 不是从 `rooms` 表真实读出

### 6. 历史消息

- `GET /api/rooms/{room_id}/messages`

输出：

```json
{
  "messages": [
    {
      "id": 1,
      "room_id": "anxious-mirror-4",
      "nickname": "雾岛邮差_65",
      "avatar_color": "anxious",
      "message_type": "chat_message",
      "content": "今天有点撑不住。",
      "created_at": "2026-06-21T10:00:00Z"
    }
  ]
}
```

说明：

- 当前消息列表来自进程内内存 `MESSAGE_STORE`
- 不是从 `messages` 表真实查询

### 7. 发消息

- `POST /api/rooms/{room_id}/messages`

输入：

```json
{
  "session_token": "session-uuid",
  "content": "我现在很想找个人说说话。"
}
```

输出：

```json
{
  "id": 2,
  "room_id": "anxious-mirror-4",
  "nickname": "雾岛邮差_65",
  "avatar_color": "anxious",
  "message_type": "chat_message",
  "content": "我现在很想找个人说说话。",
  "created_at": "2026-06-21T10:00:03Z"
}
```

说明：

- 会根据 `session_token` 恢复/创建匿名身份
- 返回标准消息后会广播给当前房间 WebSocket 连接

## 当前 WebSocket 契约（真实）

### 1. 房间连接

- `WS /api/rooms/{room_id}/ws?participantId=...`

### 2. 当前实际用途

- 用于感知进房 / 离房系统消息
- 用于接收后端在 HTTP 发消息后广播的标准消息

### 3. 当前出站事件

#### `chat_message`

```json
{
  "type": "chat_message",
  "payload": {
    "id": 2,
    "room_id": "anxious-mirror-4",
    "nickname": "雾岛邮差_65",
    "avatar_color": "anxious",
    "message_type": "chat_message",
    "content": "我现在很想找个人说说话。",
    "created_at": "2026-06-21T10:00:03Z"
  }
}
```

#### `system`

```json
{
  "type": "system",
  "payload": {
    "text": "雾岛邮差_65 已进入房间。"
  }
}
```

### 4. 当前入站事件

- 前端会建立连接，但当前聊天消息发送主路径并不依赖客户端先发 `chat_message` 给 WS
- 当前真实聊天写入主路径是 **HTTP POST message -> 后端广播 WS**

## 当前已知契约偏差

- `frontend/lib/types.ts` 目前仍声明了 `recommended_surface`，与后端不一致
- `backend/tests/test_matching_api.py` 目前仍在验证 `surfaces/suggestions`，与后端不一致
- 当前文档必须以 **后端 schema 与服务实现** 为准，而不是以超前测试/类型为准

## 当前治理规则

- 若字段只存在于前端类型或测试、但后端 schema 未实现，则视为“超前契约”
- 若未来要上 `people/rooms` 双 surface，需要先改后端 schema，再同步前端类型和测试
- 当前接口说明必须优先服务于真实演示链路
