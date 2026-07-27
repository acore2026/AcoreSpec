# 6G 样机工作流

AcoreSpec 的样机流程面向一种很具体的开发现场：同一个演示同时包含核心网服务、传输链路、Web 大屏和手机、AR 眼镜、机器狗、机械臂等端侧设备。代码能编译只是其中一环，真正的交付标准是整条链路能按固定版本启动、出现问题能恢复、关键效果能被观众看到并留下证据。

这套定制来自团队已有项目中的重复问题：

- 核心网和 Agent 服务分散在多个 Go、Python、Rust 仓库；
- HTTP、WebSocket、SCTP、QUIC、MoQ 等边界需要独立做契约和性能验证；
- Android、Windows、Linux、GPU 容器和物理设备的环境条件不同；
- 联调前必须确认分支、commit、镜像、模型和配置是否成套；
- 现场需要 reset、stop、rollback 和人工接管，不能临时猜命令；
- 时延、吞吐、丢包、FPS、CPU、内存和恢复时间需要可复现的记录。

普通软件修改继续使用 `core` profile 和 `spec-driven` schema。只有跨仓或跨设备样机才需要下面的流程。

## 启用

先把样机动作安装到已配置的 AI 工具：

```bash
openspec config profile prototype
openspec update
```

新建样机变更时显式选择 schema：

```bash
openspec new change ar-gesture-dog-demo --schema prototype-driven
```

如果一个项目长期只做样机，可把 `openspec/config.yaml` 中的 schema 改为：

```yaml
schema: prototype-driven
```

已有 change 的 `.openspec.yaml` 会保留原 schema，不会因为项目默认值改变而迁移。

## 一条完整链路

```text
brief
  └─ inventory
       └─ scenario
            └─ contracts
                 └─ design
                      └─ runbook
                           └─ acceptance
                                └─ tasks

/opsx:survey
      ↓
/opsx:apply
      ↓
/opsx:integrate
      ↓
/opsx:rehearse
      ↓
/opsx:demo
      ↓
/opsx:archive
```

artifact 解决“应该交付什么”，动作解决“现在做哪一种工作”。二者不是阶段锁：联调发现契约有误时，应当直接修改 contract 和 runbook，再继续集成。

## 八类 artifact

### brief：先说清观众看到什么

brief 不写“打造低时延智能网络”之类无法验收的目标。它需要回答：

- 谁看；
- 触发什么；
- 屏幕或设备发生什么变化；
- 哪项网络能力导致了这个变化；
- 用什么接口响应或指标证明；
- 哪部分是真实系统，哪部分仍是 mock。

例如：“AR 眼镜发出自然语言意图后，核心网完成能力路由并建立媒体链路；大屏显示状态迁移，机器狗收到经手势识别产生的受限动作指令；全链路用同一个 request ID 留证。”

### inventory：把版本、环境和设备放到一张表

inventory 不是仓库清单。每个参与者都要记录运行责任：

| 对象 | 必填信息 |
| --- | --- |
| 软件仓库 | 团队自研/深度改造/上游、分支、commit、运行主机、构建/启动/停止/健康检查、fallback |
| 容器与模型 | tag 或 digest、来源、目标主机、完整性检查、重建方式 |
| 主机 | OS、shell、访问方式、端口、依赖、日志、时钟条件 |
| 手机/AR | 型号、固件、安装包、连接方式、权限、替代端 |
| 机器狗/机械臂 | SDK、网络、动作范围、安全区、急停或人工接管、操作人 |
| 配置 | 变量名或配置项、来源和消费者；不记录密钥值 |

上游 fork 默认算依赖，只有能指出团队实际修改和维护责任时才归入深度改造。

### scenario：按观众视角写端到端状态

每一步都要有 actor、触发、网络跳点、预期状态、观众可见结果、关联字段、超时和恢复点。除 happy path 外，还要写至少一个真实失败分支以及 reset 后的初始状态。

对于视频、语音或设备控制链路，不能只写“调用服务成功”，还应写清楚：

- 信令和媒体/数据分别走哪条路径；
- 哪个状态变化显示在大屏；
- 哪个 request/session/stream ID 贯穿日志；
- 超时后是自动恢复、回退到 mock，还是停止演示。

### contracts：一个边界一个文件

HTTP、WebSocket、gRPC、SCTP、QUIC、MoQ、消息总线、文件交换和设备 SDK 都属于契约。契约至少包含生产方、消费方、版本、地址配置、关联字段、消息结构、状态、超时、重试、幂等、错误、兼容策略、观测和契约测试。

标准协议只引用标准，不复制整份规范；文件只写团队采用的版本、profile、扩展或假设。

### design：把组件图变成可部署拓扑

design 需要分别说明控制路径、用户/媒体/数据路径、状态归属和配置流。对样机尤其要检查：

- 多主机地址、NAT、防火墙和端口；
- GPU、模型、镜像和 Android 包；
- 真机与 mock 的替换点；
- 协议版本和编码兼容；
- 时钟同步是否影响时延证据；
- rollback 能否回到已知版本。

### runbook：现场只执行已经验证的命令

每条命令都记录主机、工作目录、OS/shell、预期输出、超时和安全重试规则。runbook 必须同时覆盖：

1. frozen version；
2. preflight；
3. dependency-ordered start；
4. health gate；
5. demo trigger；
6. reset；
7. reverse-order stop；
8. rollback；
9. 日志目录和常见故障特征。

Windows PowerShell/cmd 和 Unix shell 分开写。缺命令就是待办项，不让 agent 临时发明。

### acceptance：先定阈值，再跑演示

验收矩阵使用稳定 ID，并记录 procedure、pass threshold、evidence path、owner 和 `PASS/FAIL/BLOCKED`。通常至少覆盖：

- 观众可见结果；
- 端到端功能；
- 跨仓契约；
- 时延、吞吐、丢包或 FPS；
- 连续多轮稳定性；
- CPU、内存、GPU 和网络占用；
- reset 和故障恢复；
- 物理设备安全。

还需约定需要连续成功几轮，以及代码、配置、镜像、模型、固件或拓扑发生哪些变化后旧证据失效。

### tasks：任务必须落到仓库和验证命令

任务格式不是“完成后端开发”，而是：

```text
[acn-gateway] 对齐 intent contract 的 request_id 和超时；
运行契约测试并把结果写入 acceptance CON-002 的证据路径。
```

这样才能在多仓并行时知道修改位置、满足的契约和完成标准。

## 四个样机动作

### `/opsx:survey`

只读摸底当前仓库、版本、环境和设备，把结果分为 `MATCH`、`DRIFT`、`MISSING`、`BLOCKED`。它不会安装依赖、启动服务、切换分支或移动设备，也不会读取和输出 `.env` 内容。

适合在计划完成后、联调前或长时间停工后使用。

### `/opsx:integrate`

先快照每个仓库的 remote、branch、commit 和 dirty state，再按以下阶梯执行：

1. 配置和契约静态检查；
2. 各组件聚焦构建；
3. 组件测试和契约测试；
4. 依赖启动和健康检查；
5. 跨组件 smoke test；
6. reset 和可重复性检查。

脏工作区不会被 reset、clean、切分支或覆盖。失败报告定位第一处失效边界，不把后续连锁报错都当作根因。

### `/opsx:rehearse`

在无观众条件下严格按 runbook 跑完整流程，并逐项填写 acceptance。涉及机器狗、机械臂等设备时，安全区、急停或人工接管、动作范围和操作人是硬门槛；缺一项就标记 `BLOCKED`。

只有版本一致、规定的连续轮次全部通过、reset/cleanup 成功时，结果才是 `READY FOR DEMO`。

### `/opsx:demo`

现场动作不写代码、不拉新分支、不重新安装依赖，也不临时增加设备动作。它只执行 runbook 中经过彩排的 preflight、start、health、trigger、reset、stop 和 rollback。

现场输出保持简短：当前动作、观众应看到什么、正在观察哪个健康信号、下一个恢复点。详细日志和指标留在证据路径中。

## 与现有项目实践的对应

这套规则不是从术语推出来的。AcoreSpec 参考了团队公开项目里已经出现的做法：

| 实践 | 对应项目示例 | 在 AcoreSpec 中的落点 |
| --- | --- | --- |
| 多仓/多模块核心网 | `free6gc`、`acn_sdk` | inventory、contracts、repo-scoped tasks |
| SCTP/QUIC、H2/H3 对比 | `proto-test`、`h2h3-rust` | acceptance 的分位时延、吞吐、丢包、CPU 证据 |
| QUIC 迁移和恢复 | `quic-migrate` | failure path、recovery checkpoint、rollback |
| MoQ 和设备视频 | `moq`、`go2_video_streamer` | 控制路径与媒体路径分离、stream evidence |
| 手机/大屏意图展示 | `518-arch-app` | audience-visible result、状态和关联字段 |
| Agent/Skill 工作台 | `skill_workshop`、`agentic-layer-custom` | skill/command 双交付和工具契约 |

私有项目只用于提炼通用工作方式；AcoreSpec 的公开模板不包含私有接口、地址或凭据。

## 回到普通开发流程

切回通用 profile：

```bash
openspec config profile core
openspec update
```

项目默认 schema 可改回：

```yaml
schema: spec-driven
```

已创建的 prototype change 仍可继续使用，因为 schema 已写入它自己的 `.openspec.yaml`。
