## ADDED Requirements

### Requirement: Prototype profile preset

系统 SHALL 提供 `prototype` profile preset，集中启用样机开发需要的通用动作和专用动作。

#### Scenario: Selecting the preset

- **WHEN** 用户运行 `openspec config profile prototype`
- **THEN**全局配置保存 `profile: prototype`
- **AND** workflow 列表与内置 prototype profile 定义一致
- **AND**提示用户在项目中运行 `openspec update`

#### Scenario: Keeping the general profile

- **WHEN** 用户未选择 prototype profile
- **THEN**默认 `core` profile 的 workflow 集合保持不变

### Requirement: Prototype workflow set

prototype profile SHALL 包含 `propose`、`explore`、`survey`、`apply`、`integrate`、`rehearse`、`demo`、`sync` 和 `archive`。

#### Scenario: Initializing tools with prototype workflows

- **WHEN** 用户运行 `openspec init --profile prototype` 并选择支持 skills 和 commands 的工具
- **THEN**为该工具生成 prototype profile 中每个动作对应的 skill 和 command
- **AND**不生成未被该 profile 选择的动作

#### Scenario: Updating an existing project

- **WHEN** 全局 profile 为 prototype 且用户运行 `openspec update`
- **THEN**缺失的样机动作被补齐
- **AND**不属于 prototype profile 的受管动作被按现有 profile 同步规则移除

### Requirement: Explicit workflow tracking

系统 SHALL 通过显式 workflow ID 和 skill 目录映射跟踪样机动作。

#### Scenario: Detecting generated actions

- **WHEN** 检查已配置工具的 workflow 状态
- **THEN**系统通过 `survey`、`integrate`、`rehearse`、`demo` 的显式条目识别文件
- **AND**不使用目录通配规则推断受管动作
