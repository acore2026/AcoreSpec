## ADDED Requirements

### Requirement: Prototype Profile Initialization

`openspec init` SHALL 接受 `prototype` profile override，并为本次初始化生成样机动作，同时保持 `core` 为默认 profile。

#### Scenario: Initializing with prototype profile

- **WHEN** 用户运行 `openspec init --profile prototype`
- **THEN**命令使用内置 prototype workflow 集合生成所选 AI 工具的受管文件
- **AND**成功输出标明实际生成的 skills 和 commands 数量

#### Scenario: Rejecting an unknown profile

- **WHEN** 用户运行 `openspec init --profile unknown`
- **THEN**命令失败并列出 `core`、`prototype` 和 `custom` 三种可用 profile

#### Scenario: Default initialization remains compatible

- **WHEN** 用户运行 `openspec init` 且全局配置未指定 profile
- **THEN**命令继续使用 core profile
- **AND**新建的 `openspec/config.yaml` 继续使用 `spec-driven` schema
