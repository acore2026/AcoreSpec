import type { SkillTemplate, CommandTemplate } from '../types.js';

const REHEARSE_INSTRUCTIONS = `Rehearse a prototype end to end and collect acceptance evidence.

**Input**: A change name is optional. Infer it only when unambiguous; otherwise list changes and ask the user to choose.

## 1. Establish the release candidate

Load status and apply instructions, then read every context file. A rehearsal requires:
- a frozen or fully recorded version set
- complete runbook commands for preflight, start, health, reset, stop, and rollback
- an acceptance matrix with measurable thresholds and evidence destinations
- named operators for any physical device

If any prerequisite is absent, mark the affected check \`BLOCKED\`. Do not turn a rehearsal into an improvised integration session.

## 2. Confirm physical safety before action

When the scenario includes a robot, robotic arm, vehicle, AR/VR device, radio hardware, or other physical actuator, confirm:
- safety area is clear
- permitted movement is documented
- emergency stop or manual takeover works
- device and safety operators are present
- power, battery, tethering, and network conditions are acceptable

Do not trigger device movement until these checks pass. A missing safety prerequisite is \`BLOCKED\`, not a warning to bypass.

## 3. Execute one complete run

Follow the runbook exactly:

1. preflight and version-drift check
2. reset to the declared initial state
3. dependency-ordered startup and health gates
4. audience-visible happy path
5. declared failure and recovery path where safe
6. final reset
7. stop and cleanup

Use existing commands only. Track step timestamps and correlation identifiers so evidence from UI, core services, transport, and devices can be connected.

## 4. Evaluate every acceptance item

For each acceptance ID record:
- \`PASS\`, \`FAIL\`, or \`BLOCKED\`
- observed value and threshold
- evidence path
- version set
- operator notes

Collect only relevant evidence. Summarize latency percentiles, throughput, loss, FPS, CPU, memory, GPU, repeated-run count, or recovery time when the acceptance matrix asks for them. Do not dump secret-bearing configuration or unrelated logs.

## 5. Repeat and invalidate honestly

Run the number of consecutive rehearsals required by \`acceptance.md\`. A code, config, image, model, firmware, topology, or runbook change invalidates previous evidence when the acceptance artifact says it does. Do not combine results from different version sets into one passing streak.

## 6. Leave the system safe

Always attempt the declared reset and cleanup for components started during the rehearsal. Verify physical devices are stationary or in their documented safe state. Report anything still running or unreachable.

## 7. Report

Return:

\`\`\`markdown
## Rehearsal report: <change>

### Run identity
<UTC time, version set, environment, operators>

### Steps
| Step | Start / end | Result | Correlation | Evidence |

### Acceptance
| ID | Status | Observed / threshold | Evidence | Notes |

### Cleanup
| Component / device | Expected final state | Observed state |

### Verdict
READY FOR DEMO / REHEARSE AGAIN / BLOCKED
\`\`\`

Only use \`READY FOR DEMO\` when the required consecutive runs pass, cleanup succeeds, no version drift exists, and every mandatory safety check passes.`;

export function getRehearseSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-rehearse',
    description: 'Run a complete prototype rehearsal, evaluate acceptance criteria, and collect traceable evidence.',
    instructions: REHEARSE_INSTRUCTIONS,
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'acore2026', version: '1.0' },
  };
}

export function getOpsxRehearseCommandTemplate(): CommandTemplate {
  return {
    name: 'OPSX: Rehearse',
    description: 'Rehearse a prototype end to end and collect acceptance evidence',
    category: 'Prototype',
    tags: ['prototype', 'rehearsal', 'evidence'],
    content: REHEARSE_INSTRUCTIONS,
  };
}
