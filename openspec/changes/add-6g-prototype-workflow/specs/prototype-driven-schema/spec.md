## ADDED Requirements

### Requirement: Built-in prototype schema

系统 SHALL 提供名为 `prototype-driven` 的内置 schema，用于同时涉及多个软件仓库、运行环境和端侧设备的样机变更。

#### Scenario: Discovering the schema

- **WHEN** 用户运行 `openspec schemas`
- **THEN** 输出包含来源为 package 的 `prototype-driven`
- **AND** artifact 流程按依赖顺序展示

#### Scenario: Starting a prototype change

- **WHEN** 用户运行 `openspec new change ar-dog-demo --schema prototype-driven`
- **THEN** 新变更绑定 `prototype-driven`
- **AND** status 输出展示该 schema 定义的全部 artifact

### Requirement: Prototype planning artifacts

`prototype-driven` schema SHALL 覆盖样机开发所需的目标、资产、场景、契约、设计、运行、验收和任务信息。

#### Scenario: Completing planning artifacts

- **WHEN** agent 按 schema 指令完成 apply 前置 artifact
- **THEN**变更至少包含 `brief.md`、`inventory.md`、`scenario.md`、`contracts/**/*.md`、`design.md`、`runbook.md`、`acceptance.md` 和 `tasks.md`
- **AND** `openspec instructions apply` 将这些文件作为实现上下文返回

#### Scenario: Capturing mixed prototype assets

- **WHEN** 样机包含核心网服务、Web 页面、Android 端、远程 Linux 主机和物理设备
- **THEN** inventory 模板要求逐项记录仓库、责任、版本、运行位置、依赖、健康检查和替代方案

### Requirement: End-to-end scenario contract

场景 artifact SHALL 把观众可见结果与真实网络和设备路径关联起来，且明确正常流程、失败分支和 reset 行为。

#### Scenario: Describing a device-to-network demo

- **WHEN** 用户设计从端侧设备发起并经过多个网络服务的演示
- **THEN** scenario 记录触发条件、逐跳交互、状态变化、观众可见反馈、超时和失败恢复
- **AND**每一步可通过日志、接口响应、指标或设备状态进行观察

### Requirement: Explicit integration contracts

契约 artifact SHALL 按明确文件记录跨仓接口，不得以宽泛文件匹配推断需要维护的契约。

#### Scenario: Defining cross-repository interfaces

- **WHEN** 两个或多个仓库通过 HTTP、WebSocket、gRPC、SCTP、QUIC、MoQ 或设备 SDK 协作
- **THEN**每份契约记录生产方、消费方、协议、版本、地址配置方式、请求关联字段、超时、错误和兼容策略

### Requirement: Operational runbook and evidence

schema SHALL 要求运行手册和验收文档包含可执行步骤、回退路径和证据位置。

#### Scenario: Preparing a rehearsal

- **WHEN** runbook 和 acceptance 完成
- **THEN** runbook 包含启动顺序、preflight、健康检查、reset、stop 和 rollback
- **AND** acceptance 包含功能、性能、稳定性、设备安全和观众可见结果的通过标准
- **AND**证据位置使用跨平台可表达的项目相对路径

#### Scenario: Handling Windows and Unix participants

- **WHEN** 样机同时包含 Windows 端和 Linux/macOS 端
- **THEN**模板要求分别记录平台适用命令
- **AND**不得把仅适用于正斜杠路径或某一种 shell 的写法声明为全平台步骤
