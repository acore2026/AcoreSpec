## Why

现有 `spec-driven` 流程适合单仓软件需求，但 6G 样机通常同时涉及核心网服务、传输协议、容器环境、展示页面和手机、AR 眼镜、机器狗等端侧设备。仅有 proposal、design、tasks 还不足以约束跨仓联调、现场恢复、指标留证和物理设备安全，团队已经在多个项目里重复补写这些内容。

## What Changes

- 新增内置 `prototype-driven` schema，把样机目标、资产清单、端到端场景、接口契约、集成设计、运行手册、验收证据和实施任务纳入同一变更。
- 新增 `prototype` 工作流 profile，保留通用开发动作，并默认启用样机专用动作。
- 新增 `/opsx:survey`、`/opsx:integrate`、`/opsx:rehearse`、`/opsx:demo` 四个动作，分别用于摸底、跨仓联调、彩排和现场演示。
- 在动作中固化团队已有做法：明确仓库/分支/commit、记录镜像与模型版本、按启动批次归档日志、检查端口和依赖、保留 reset/rollback 路径、采集时延/吞吐/丢包/资源指标、区分 mock 与真实设备。
- 增加面向 6G 样机的中文使用文档和可直接运行的示例流程。
- 保留 `core` profile 和 `spec-driven` 默认 schema，已有项目升级后不会被强制切换。

## Capabilities

### New Capabilities

- `prototype-driven-schema`: 提供适合跨仓、跨设备样机开发的内置 artifact schema 和模板。
- `prototype-workflow-profile`: 提供可显式选择的样机工作流 profile，并在 init、config 和 update 中保持一致。
- `prototype-actions`: 生成样机摸底、联调、彩排和演示动作，且适配现有所有 skill/command 交付目标。

### Modified Capabilities

- `cli-init`: `openspec init --profile prototype` 可初始化样机工作流，同时保留原有 `core` 默认行为。

## Impact

- 代码：profile 配置、workflow 模板注册、skill/command 检测与同步逻辑。
- 资源：新增 `schemas/prototype-driven/` 和四组动作模板。
- 测试：schema 解析、profile 选择、生成文件、配置同步和动作内容测试。
- 文档：README、命令参考、工作流说明和样机专用指南。
- 发布：新增用户可见能力，需要 changeset；不引入新的运行时依赖。
