# 进度追踪

## 当前里程碑

- M1 - 正式赛题收敛与可演示主链路建立

## 当前阶段目标

- 让 VibeChat 具备可稳定展示的分析、匹配、匿名聊天主链路
- 保持前后端结构清晰，并同步项目记忆到真实状态
- 在现有房间策略匹配基础上，继续增强产品表达与入口系统

## 已完成

- FastAPI + PostgreSQL 通用底座
- Docker PostgreSQL 配置
- 前端迁移到 Next.js 14
- 首页输入 -> 分析 -> 匹配 -> 房间聊天主链路打通
- OpenAI 兼容接口（老张 API）接入
- Anthropic / mock provider 保留
- 图片生成功能已从主应用入口移除
- 匿名 `session_token -> nickname/avatar_color -> message` 链路打通
- 分析结果卡支持基于情绪字段的动态颜色和动态分析语句
- 项目记忆 skill 骨架已建立

## 进行中

- 同步 `project-memory` 文档到真实代码状态
- 稳定分析页与匹配契约
- 设计首页“创建房间 / 查找房间”入口
- 增强匹配策略的产品呈现

## 待开始

- 真实房间创建/查找接口
- 匹配人 / 匹配房间双 surface 契约
- 房间与消息的真实数据库持久化
- 公网稳定演示链路

## 当前真实风险

- `/match` 已退化为重定向页，文档若仍写成独立流程会误导后续开发
- `frontend/lib/types.ts` 中 `recommended_surface` 等字段超前于后端真实实现
- `backend/tests/test_matching_api.py` 也在验证超前契约
- `AnalyzeResultFlow.tsx` 曾发生过文件删除/恢复中断类问题，分析页链路稳定性需要注意
- 房间、消息、参与人数仍主要依赖进程内内存，不适合多实例和重启恢复

## 当前阻塞项

- 当前没有业务题目层阻塞
- 主要阻塞来自：
  - 契约与实现暂时不同步
  - 时间预算有限
  - 仍需在功能增强与演示稳定之间取舍

## 下一步

1. 完成项目记忆文档同步
2. 修复并稳定分析页模块与类型契约
3. 推进“创建房间 / 查找房间”入口设计与开发
4. 再决定是否先补真实持久化，还是先补更完整的匹配 surface

## 文档新鲜度

- `project-overview.md`：本次会话同步到真实状态
- `implementation-plan.md`：本次会话同步到真实执行路线
- `change-log.md`：需追加本次项目记忆全面同步记录
- `progress-tracker.md`：本次会话同步
- `database-design.md`：需明确“模型已存在但运行时未完全启用”
- `api-event-contracts.md`：需改成当前真实匹配契约
- `part-to-part-contracts-v1.md`：需去掉图像模型边界，补上 localStorage / WebSocket / session 契约
- `code-structure.md`：需标注 `/match` 重定向、`HomeEmotionEntry` 遗留、分析页核心文件状态
- `third-party-dependencies.md`：需补充 motion/react 与当前前端真实依赖
