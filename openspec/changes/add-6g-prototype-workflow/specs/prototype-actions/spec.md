## ADDED Requirements

### Requirement: Survey action

系统 SHALL 生成 `/opsx:survey` 动作，用于在规划或联调前核对仓库、版本、环境、设备和已知风险。

#### Scenario: Surveying a prototype

- **WHEN** 用户执行 `/opsx:survey <change>`
- **THEN** agent 读取 change context 和可用项目资料
- **AND**区分自主项目、深度改造项目和上游依赖
- **AND**输出缺口、冲突和建议写回的 inventory 内容
- **AND**不得读取或输出密钥内容

### Requirement: Integrate action

系统 SHALL 生成 `/opsx:integrate` 动作，用于按 runbook 和契约执行跨仓构建、部署和连通性验证。

#### Scenario: Integrating multiple repositories

- **WHEN** 用户执行 `/opsx:integrate <change>`
- **THEN** agent 先记录每个参与仓库的分支、commit 和工作区状态
- **AND**按依赖顺序执行最小构建与健康检查
- **AND**为每个失败记录具体组件、命令、日志位置和恢复结果

#### Scenario: Protecting user work

- **WHEN**参与仓库有未提交修改或版本与 inventory 不符
- **THEN** agent 保留现有修改
- **AND**停止会覆盖该工作区的操作
- **AND**将冲突报告给用户或转入不修改该仓库的验证路径

### Requirement: Rehearse action

系统 SHALL 生成 `/opsx:rehearse` 动作，用于在无观众条件下完整执行演示并按 acceptance 收集证据。

#### Scenario: Running a rehearsal

- **WHEN** 用户执行 `/opsx:rehearse <change>`
- **THEN** agent 执行 preflight、reset、主流程、失败恢复和 cleanup
- **AND**记录每项 acceptance 的 PASS、FAIL 或 BLOCKED
- **AND**证据包含时间、版本、日志或报告位置及关键指标

#### Scenario: Exercising physical devices

- **WHEN**彩排包含机器狗、机械臂、AR 眼镜或其它物理设备
- **THEN** agent 在动作前确认安全区域、急停或人工接管方式和可接受动作范围
- **AND**未满足安全前提时把相关步骤标记为 BLOCKED，不自行绕过

### Requirement: Demo action

系统 SHALL 生成 `/opsx:demo` 动作，用于已通过彩排的版本进行现场 preflight、演示控制和恢复。

#### Scenario: Starting a live demo

- **WHEN** 用户执行 `/opsx:demo <change>`
- **THEN** agent 验证已通过的 rehearsal 证据和冻结版本
- **AND**只执行 runbook 中明确列出的启动、健康检查、演示、reset 和 stop 命令
- **AND**提供当前步骤、观众可见结果和下一恢复点的简洁状态

#### Scenario: Demo prerequisite is missing

- **WHEN**没有成功 rehearsal、版本发生漂移或关键健康检查失败
- **THEN** agent 不宣布现场演示就绪
- **AND**输出具体阻塞项和可执行恢复步骤

### Requirement: Tool-neutral action generation

四个样机动作 SHALL 复用现有 tool adapter 和 skill 生成机制。

#### Scenario: Generating for different AI tools

- **WHEN**同一个样机动作生成给 Claude、Cursor、Codex 或其它已注册工具
- **THEN**动作正文语义一致
- **AND**路径和 frontmatter 遵循对应 adapter
