---
name: project-memory
description: 项目记忆与执行上下文骨架。用于需要跨会话维护项目记忆的场景，包括项目总览、实施计划、变更日志、进度追踪、数据库设计、API/事件契约、模块间契约、代码结构和第三方依赖。也适用于在详细需求尚未明确前，先初始化一套可持续维护的项目记忆系统。
---

# Project Memory

这个 skill 用来给一个会跨多个会话推进的项目建立稳定记忆层。

## 核心分工

- `SKILL.md`：定义怎么使用这套记忆系统
- `references/*.md`：记录项目当前事实

不要把项目事实大量堆进 `SKILL.md`。

## 什么时候使用

在以下情况优先使用这个 skill：

- 需要跨会话保留项目上下文
- 需要在题目未定前先搭项目记忆框架
- 需要长期维护计划、进度、架构、数据、接口和依赖信息
- 需要在后续快速恢复项目状态

## 比赛快速模式

短时比赛默认启用以下两条准则：

### 1. 快交付优先

- 优先尽快交付可运行、可展示、可讲解的结果
- 不引入过多验证、繁琐流程、重型治理步骤
- 只保留必要检查：
  - 能运行
  - 主链路能演示
  - 没有明显阻断错误

### 2. 前端主导

- 先按前端页面、功能、交互、展示效果来设计方案
- `implementation-plan.md` 优先按前端功能模块组织
- 后端和数据库只做支撑前端功能的最小闭环
- 保持清晰和可维护，但不过度工程化

## 默认阅读顺序

新会话开始时按这个顺序读：

1. `references/project-overview.md`
2. `references/progress-tracker.md`
3. `references/implementation-plan.md`

然后按任务补读：

- 数据/模型：`references/database-design.md`
- 后端/API：`references/api-event-contracts.md`
- 跨边界集成：`references/part-to-part-contracts-v1.md`
- 找代码位置：`references/code-structure.md`
- 外部依赖/服务：`references/third-party-dependencies.md`

重大实现前，先读 `references/implementation-plan.md`。如果方向或边界要变，再读 `references/change-log.md`。

## 文件职责

- `project-overview.md`：项目是什么，边界到哪
- `implementation-plan.md`：当前打算怎么做
- `change-log.md`：为什么发生重要变化
- `progress-tracker.md`：项目推进到哪了
- `database-design.md`：数据模型怎么设计
- `api-event-contracts.md`：当前服务侧 API/事件契约是什么
- `part-to-part-contracts-v1.md`：不同部分之间怎么交换数据和上下文
- `code-structure.md`：代码实际上放在哪里
- `third-party-dependencies.md`：依赖哪些外部基础设施和框架，为什么依赖

## 更新规则

以下事实变化时，应在同一会话同步更新对应 reference 文件：

- 项目范围
- 实施计划
- 架构方案
- 数据结构
- API 契约
- 依赖选择
- 里程碑状态
- 阻塞项
- 集成边界

不要为以下内容更新项目记忆：

- 纯格式调整
- 小措辞修改
- 明显 typo
- 已放弃的小实验

如果事实未定，要明确写成：已确定 / 暂定 / 延后 / 阻塞 / 未知。

## 比赛题目出来后的建议顺序

1. 更新 `project-overview.md`
2. 建第一版 `implementation-plan.md`
3. 初始化 `progress-tracker.md`
4. 需要持久化时更新 `database-design.md`
5. 随实现推进更新 API、边界、结构、依赖相关文件

## 治理底线

- 重大变化后，记忆文档不能长期落后于真实状态
- 不要在这些文件里写密钥或敏感凭据
- `change-log.md` 记录“为什么”，不是 git diff 镜像
- 比赛模式下，规则不能反过来拖慢实现速度
