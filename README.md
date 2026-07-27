<p align="center">
  <a href="https://github.com/acore2026/AcoreSpec">
    <picture>
      <source srcset="assets/openspec_bg.png">
      <img src="assets/openspec_bg.png" alt="AcoreSpec">
    </picture>
  </a>
</p>

<p align="center">
  <a href="https://github.com/acore2026/AcoreSpec/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/acore2026/AcoreSpec/actions/workflows/ci.yml/badge.svg" /></a>
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" /></a>
  <a href="https://discord.gg/YctCnvvshC"><img alt="Discord" src="https://img.shields.io/discord/1411657095639601154?style=flat-square&logo=discord&logoColor=white&label=Discord&suffix=%20online" /></a>
</p>

<details>
<summary><strong>AcoreSpec：面向 6G 样机开发的 OpenSpec 分支</strong></summary>

[![Stars](https://img.shields.io/github/stars/acore2026/AcoreSpec?style=flat-square&label=Stars)](https://github.com/acore2026/AcoreSpec/stargazers)
[![Contributors](https://img.shields.io/github/contributors/acore2026/AcoreSpec?style=flat-square&label=Contributors)](https://github.com/acore2026/AcoreSpec/graphs/contributors)

</details>
<p></p>
AcoreSpec 保留 OpenSpec 的通用 SDD 流程，同时增加跨仓、跨主机和跨设备样机所需的工作流：

```text
需求与场景说清楚
→ 仓库、环境和设备盘清楚
→ 契约与启动顺序固定下来
→ 跨仓联调
→ 无观众彩排并留证
→ 使用冻结版本现场演示
```

> [!TIP]
> **New workflow now available!** We've rebuilt OpenSpec with a new artifact-guided workflow.
>
> Run `/opsx:propose "your idea"` to get started. → [Learn more here](docs/opsx.md)

## 这不是一次改名

团队的样机项目同时涉及核心网网元与 Agent、SCTP/QUIC/MoQ、容器和 GPU、Android/AR、大屏、机器狗与机械臂。真正影响交付的往往不是某个函数，而是以下问题：

- 参与联调的仓库、branch、commit、镜像和模型是否成套；
- HTTP、WebSocket、SCTP、QUIC、MoQ 和设备 SDK 的生产方/消费方是否对齐；
- Windows、Linux、Android 和远程设备该按什么顺序启动，如何做 health、reset、stop 和 rollback；
- 时延、吞吐、丢包、FPS、CPU、内存和恢复时间在哪里采集；
- 物理设备的安全区、急停或人工接管是否在演示前验证过；
- 现场发生故障时，从哪个恢复点继续，而不是临时改代码。

AcoreSpec 为此增加：

| 能力 | 用途 |
| --- | --- |
| `prototype-driven` schema | 生成 brief、inventory、scenario、contracts、design、runbook、acceptance、tasks |
| `prototype` profile | 一次启用样机所需的通用动作和专用动作 |
| `/opsx:survey` | 只读核对仓库、环境、设备和版本漂移 |
| `/opsx:integrate` | 按契约和运行手册完成跨仓构建、启动和连通性验证 |
| `/opsx:rehearse` | 跑完整彩排，逐项填写验收结果和证据 |
| `/opsx:demo` | 只使用彩排通过的冻结版本、命令和恢复路径进行现场演示 |

具体做法和完整示例见 [6G 样机工作流](docs/prototype-workflow.md)。

<!-- TODO: Add GIF demo of /opsx:propose → /opsx:archive workflow -->

## See it in action

```text
You: /opsx:propose add-dark-mode
AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!

You: /opsx:apply
AI:  Implementing tasks...
     ✓ 1.1 Add theme context provider
     ✓ 1.2 Create toggle component
     ✓ 2.1 Add CSS variables
     ✓ 2.2 Wire up localStorage
     All tasks complete!

You: /opsx:archive
AI:  Archived to openspec/changes/archive/2025-01-23-add-dark-mode/
     Specs updated. Ready for the next feature.
```

<details>
<summary><strong>OpenSpec Dashboard</strong></summary>

<p align="center">
  <img src="assets/openspec_dashboard.png" alt="OpenSpec dashboard preview" width="90%">
</p>

</details>

## Quick Start

**Requires Node.js 20.19.0 or higher.**

Install this fork globally from GitHub:

```bash
npm install -g https://github.com/acore2026/AcoreSpec/archive/refs/heads/main.tar.gz
```

Then navigate to your project directory and initialize:

```bash
cd your-project
openspec init
```

Now tell your AI: `/opsx:propose <what-you-want-to-build>`

If you want the expanded workflow (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), select it with `openspec config profile` and apply with `openspec update`.

样机项目启用专用 profile：

```bash
openspec config profile prototype
openspec update
openspec new change ar-gesture-dog-demo --schema prototype-driven
```

然后按 `/opsx:survey` → `/opsx:apply` → `/opsx:integrate` → `/opsx:rehearse` → `/opsx:demo` 推进。

> [!NOTE]
> Not sure if your tool is supported? [View the full list](docs/supported-tools.md) – we support 25+ tools and growing.
>
> Also works with pnpm, yarn, bun, and nix. [See installation options](docs/installation.md).

## Docs

→ **[Getting Started](docs/getting-started.md)**: first steps<br>
→ **[Workflows](docs/workflows.md)**: combos and patterns<br>
→ **[Commands](docs/commands.md)**: slash commands & skills<br>
→ **[CLI](docs/cli.md)**: terminal reference<br>
→ **[Supported Tools](docs/supported-tools.md)**: tool integrations & install paths<br>
→ **[Concepts](docs/concepts.md)**: how it all fits<br>
→ **[Multi-Language](docs/multi-language.md)**: multi-language support<br>
→ **[Customization](docs/customization.md)**: make it yours
<br>→ **[6G Prototype Workflow](docs/prototype-workflow.md)**: 跨仓、端侧、彩排和现场演示


## Community schemas

Third-party schema bundles distributed via standalone repositories — these provide opinionated workflows that integrate OpenSpec with other tools, similar to how [github/spec-kit's community extension catalog](https://github.com/github/spec-kit/tree/main/extensions) handles tool integrations.

→ **[Browse the catalog](docs/customization.md#community-schemas)** in the customization docs.


## Why OpenSpec?

AI coding assistants are powerful but unpredictable when requirements live only in chat history. OpenSpec adds a lightweight spec layer so you agree on what to build before any code is written.

- **Agree before you build** — human and AI align on specs before code gets written
- **Stay organized** — each change gets its own folder with proposal, specs, design, and tasks
- **Work fluidly** — update any artifact anytime, no rigid phase gates
- **Use your tools** — works with 20+ AI assistants via slash commands

### How we compare

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — Thorough but heavyweight. Rigid phase gates, lots of Markdown, Python setup. OpenSpec is lighter and lets you iterate freely.

**vs. [Kiro](https://kiro.dev)** (AWS) — Powerful but you're locked into their IDE and limited to Claude models. OpenSpec works with the tools you already use.

**vs. nothing** — AI coding without specs means vague prompts and unpredictable results. OpenSpec brings predictability without the ceremony.

## Updating OpenSpec

**Upgrade the package**

```bash
npm install -g https://github.com/acore2026/AcoreSpec/archive/refs/heads/main.tar.gz
```

**Refresh agent instructions**

Run this inside each project to regenerate AI guidance and ensure the latest slash commands are active:

```bash
openspec update
```

## Usage Notes

**Model selection**: OpenSpec works best with high-reasoning models. We recommend Opus 4.5 and GPT 5.2 for both planning and implementation.

**Context hygiene**: OpenSpec benefits from a clean context window. Clear your context before starting implementation and maintain good context hygiene throughout your session.

## Contributing

**Small fixes** — Bug fixes, typo corrections, and minor improvements can be submitted directly as PRs.

**Larger changes** — For new features, significant refactors, or architectural changes, please submit an OpenSpec change proposal first so we can align on intent and goals before implementation begins.

When writing proposals, keep the OpenSpec philosophy in mind: we serve a wide variety of users across different coding agents, models, and use cases. Changes should work well for everyone.

**AI-generated code is welcome** — as long as it's been tested and verified. PRs containing AI-generated code should mention the coding agent and model used (e.g., "Generated with Claude Code using claude-opus-4-5-20251101").

### Development

- Install dependencies: `pnpm install`
- Build: `pnpm run build`
- Test: `pnpm test`
- Develop CLI locally: `pnpm run dev` or `pnpm run dev:cli`
- Conventional commits (one-line): `type(scope): subject`

## Other

<details>
<summary><strong>Telemetry</strong></summary>

OpenSpec collects anonymous usage stats.

We collect only command names and version to understand usage patterns. No arguments, paths, content, or PII. Automatically disabled in CI.

**Opt-out:** `export OPENSPEC_TELEMETRY=0` or `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>Maintainers & Advisors</strong></summary>

See [MAINTAINERS.md](MAINTAINERS.md) for the list of core maintainers and advisors who help guide the project.

</details>



## License

MIT
