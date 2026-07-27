import type { SkillTemplate, CommandTemplate } from '../types.js';

const DEMO_INSTRUCTIONS = `Operate a rehearsed prototype during a live demonstration.

This action is for execution of an already integrated and rehearsed release. It is not a shortcut around planning, implementation, or rehearsal.

**Input**: A change name is optional. Infer it only when unambiguous; otherwise list changes and ask the user to choose.

## 1. Gate entry to live mode

Load the change status, apply context, runbook, acceptance matrix, and latest rehearsal evidence. Verify:
- the required rehearsal streak passed
- current repositories, images, packages, models, firmware, config, and topology match the frozen version set
- critical hosts, ports, clocks, credentials-by-reference, and devices pass preflight
- reset, stop, rollback, emergency stop, and manual takeover are available
- demo and safety operators are present

If evidence is missing, versions drifted, or a critical health/safety check fails, do not announce readiness. Return \`NOT READY\` with the exact blocker and recovery step.

## 2. Use only the approved runbook

Execute only commands and actions explicitly listed in the runbook:
- preflight
- initial reset
- dependency-ordered start
- health gates
- demo trigger and operator cues
- reset between runs
- stop, cleanup, or rollback

Do not edit code, pull branches, rebuild unplanned artifacts, install dependencies, change firmware, or improvise physical movement in live mode. If implementation work is needed, exit live mode and return to integrate/rehearse.

## 3. Keep operator output short

For each step show:
- current action
- expected audience-visible result
- health gate or evidence being watched
- next recovery checkpoint

Do not flood the operator with raw logs. Keep detailed evidence paths for the report and surface only errors that require action.

## 4. Handle failure from the first safe checkpoint

On failure:

1. stop issuing new demo triggers
2. protect people and physical devices
3. capture the correlation ID and first failing boundary
4. use the documented reset or rollback
5. re-run the documented health gate
6. resume only when the runbook permits it

Do not retry indefinitely. Respect the runbook's retry count and time budget. If recovery fails, stop the demo path and state what remains active.

## 5. Close the demo

Run reset, stop, and cleanup. Verify services and devices reach their declared final state. Preserve the frozen version manifest and evidence index without copying secrets.

## 6. Report

Return:

\`\`\`markdown
## Live demo report: <change>

### Release and venue
<time, version set, environment, operators>

### Runs
| Run | Audience-visible result | Health | Recovery used | Evidence |

### Incidents
| Time | First failing boundary | Audience impact | Recovery | Final state |

### Cleanup
| Component / device | Expected | Observed |

### Final outcome
COMPLETED / COMPLETED WITH RECOVERY / STOPPED SAFELY
\`\`\``;

export function getDemoSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-demo',
    description: 'Operate a rehearsed prototype during a live demo with strict release, safety, and recovery gates.',
    instructions: DEMO_INSTRUCTIONS,
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'acore2026', version: '1.0' },
  };
}

export function getOpsxDemoCommandTemplate(): CommandTemplate {
  return {
    name: 'OPSX: Demo',
    description: 'Operate a rehearsed prototype with live safety and recovery gates',
    category: 'Prototype',
    tags: ['prototype', 'demo', 'operations', 'safety'],
    content: DEMO_INSTRUCTIONS,
  };
}
