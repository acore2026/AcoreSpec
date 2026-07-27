## Context

团队仓库已经形成几类稳定做法：跨仓启动脚本会检查脏工作区和目标分支；镜像交付会记录 commit 与 tag；联调服务按启动批次保存日志；协议实验输出 CSV、延迟分位数、丢包和 CPU；端侧场景需要 mock/真机切换、reset 以及人工接管。现有 OpenSpec 可以自定义 artifact schema，但内置流程和生成动作没有表达这些样机约束。

AcoreSpec 仍需兼容 Node.js 20.19.0 及现有 AI tool adapter。仓库为公开仓库，设计只固化从私有项目抽象出的工作方式，不写入私有地址、接口载荷或部署凭据。

## Goals / Non-Goals

**Goals:**

- 提供一条开箱可选、但不破坏上游默认体验的样机开发路径。
- 让 artifact 同时覆盖软件实现、环境、设备、演示和证据。
- 让四个专用动作通过现有生成器覆盖所有支持的 AI 工具。
- 把物理设备安全、版本冻结、reset 和证据留存写成动作的硬约束。
- 用测试保证 profile、schema、skill 和 command 列表始终一致。

**Non-Goals:**

- 不在 CLI 中实现 Docker、SSH、Android、AR 或机器人控制器。
- 不自动发现用户所有 GitHub 仓库，也不保存 GitHub 元数据。
- 不让 `/opsx:demo` 绕过用户授权执行未在 runbook 中声明的外部动作。
- 不把 `prototype-driven` 设为所有用户的默认 schema。
- 不重构现有 adapter 或 artifact graph。

## Decisions

### 1. 使用内置 schema 表达样机规划

新增 `schemas/prototype-driven/`，artifact 图为：

```text
brief
  │
  ├── inventory
  │      │
  └── scenario
         │
      contracts
         │
       design
         │
       runbook
         │
      acceptance
         │
        tasks
```

`scenario` 同时依赖 brief 和 inventory；`contracts` 同时依赖 scenario 和 inventory。后续 artifact 保持单向依赖，避免生成时出现互相等待。

选择内置 schema 而不是只提供文档示例，是为了让 `status`、`instructions` 和 `apply` 能读取同一套上下文。没有新增 schema 解析逻辑。

### 2. 新增 prototype profile，不改变 core 默认值

`Profile` 扩展为 `core | prototype | custom`。`prototype` 是显式 preset，包含通用动作和四个样机动作。`core` 和 `spec-driven` 仍为默认值，避免升级后已有项目突然多出动作或改变 artifact 格式。

相较于直接把四个动作加入 core，这种方式更容易在通用软件项目和样机项目之间切换，也能通过 `openspec update` 使用现有的受管文件清理逻辑。

### 3. 四个动作是 agent workflow，不是硬编码编排器

新增四个 workflow template 模块，并登记到 `ALL_WORKFLOWS`、`SKILL_NAMES`、`COMMAND_IDS` 和 workflow-to-skill 映射。每个动作同时提供 SkillTemplate 与 CommandTemplate，与现有动作保持相同生成链。

动作要求只执行仓库已有、runbook 明确列出的命令。这样能够适应 Python、Go、Rust、Android、Docker 和设备 SDK 的不同组合，而无需在 CLI 中维护一套脆弱的通用编排 DSL。

### 4. 证据采用 Markdown 索引，不搬运大文件

rehearse 和 demo 报告记录证据相对路径、指标摘要、版本和时间。视频、pcap、CSV、模型、容器日志等大文件仍留在项目约定位置。动作禁止把密钥、token 或 `.env` 内容写入报告。

### 5. 受管名称全部显式登记

新增 workflow 的 ID、skill 目录和 command ID 均进入现有常量，删除和 drift 检测继续枚举这些常量。不会通过 `opsx-*` 通配符推断受管文件，避免删除团队自定义动作。

## Risks / Trade-offs

- [artifact 数量从 4 个增加到 8 个] → prototype schema 只用于跨仓/跨设备样机；普通修改继续使用 spec-driven。
- [动作依赖 agent 对各项目命令的理解] → 强制读取 inventory、contracts、runbook 和 acceptance，缺失命令时标记 BLOCKED，不自行发明。
- [现场动作可能触发外部系统或物理设备] → demo 要求成功彩排、冻结版本、安全前提和现成恢复命令；任何一项缺失都不进入 ready。
- [profile 常量分散在多个模块] → 保持显式列表，并增加集合一致性测试，暂不借机重构。
- [跨平台命令差异] → schema 模板要求标注 OS/shell，动作只执行与当前平台匹配的条目。
- [公开文档泄露私有实践细节] → 示例只使用公开仓库或泛化组件名，不包含私有端点、凭据和部署地址。

## Migration Plan

1. 发布新增 schema、profile 和 workflow 模板。
2. 现有用户不操作时继续使用 core/spec-driven。
3. 样机项目运行 `openspec config profile prototype` 和 `openspec update`。
4. 新变更通过 `--schema prototype-driven` 创建；也可在项目 `openspec/config.yaml` 中设为默认。
5. 回退时切回 `openspec config profile core`、运行 `openspec update`，并把项目 schema 改回 `spec-driven`；已有 prototype change 仍由其 metadata 绑定原 schema。

## Open Questions

- 后续是否把 rehearsal 证据升级为 CLI 可解析的 JSON，目前先以 Markdown 报告验证团队使用方式。
- workspace 功能稳定后，可把 inventory 的 repo 列表与 workspace link 关联；本次不依赖实验性 workspace API。
