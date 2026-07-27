import type { SkillTemplate, CommandTemplate } from '../types.js';

const INTEGRATE_INSTRUCTIONS = `Integrate a multi-repository prototype against its declared contracts and runbook.

**Input**: A change name is optional. Infer it only when unambiguous; otherwise list changes and ask the user to choose.

## 1. Load the integration contract

Run:

\`\`\`bash
openspec status --change "<name>" --json
openspec instructions apply --change "<name>" --json
\`\`\`

Read every context file. Integration requires enough information to identify participants, versions, contracts, startup order, health checks, and acceptance criteria. If inventory, contracts, or runbook details are missing, stop the affected path and report it as \`BLOCKED\`; do not invent commands or endpoints.

## 2. Snapshot before changing anything

For every participating repository capture:
- absolute or workspace-resolved location
- remote, branch, commit, and dirty state
- expected branch/commit/tag from inventory
- build artifact, container image, model, firmware, or package version

Preserve user changes. If a working tree is dirty, do not switch branches, reset, clean, overwrite generated output, or pull over it. Continue only with read-only checks or with an isolated path already approved by the user.

## 3. Run the smallest useful integration ladder

Follow dependency order from the runbook:

1. static config and contract consistency
2. focused build or package check per component
3. component tests and contract tests
4. start dependencies
5. health and port checks
6. cross-component request, stream, or device-path smoke test
7. reset and repeatability check

Use commands already present in the repository or runbook. Record the host, working directory, OS/shell, command, start/end time, exit status, and log location. Never expose secret values.

For remote hosts or physical devices:
- confirm the target identity before copying or running artifacts
- keep deployment and stop commands scoped to the named service
- require the documented safety area and operator before movement
- do not broaden the user's request to package installation, firmware updates, or destructive cleanup

## 4. Correlate the end-to-end path

Use request IDs, session IDs, trace IDs, stream IDs, timestamps, or another declared field to connect evidence across components. Check protocol version, schema, timeout, retry, ordering, flow control, and error behavior at each owned boundary.

If a failure occurs, identify the first failing boundary. Do not describe every downstream symptom as a separate root cause.

## 5. Reset and leave a known state

Run the declared reset, stop, or rollback procedure for anything started during integration. Verify the final state. If cleanup fails, say exactly what remains running and how to stop it.

## 6. Report

Return:

\`\`\`markdown
## Integration report: <change>

### Version set
| Component | Branch / commit / artifact | Dirty | Match |

### Checks
| ID | Boundary or component | Command / probe | Result | Evidence |

### Metrics
| Signal | Observed | Target | Result |

### Failures and recovery
| First failing boundary | Cause | Recovery attempted | Final state |

### Outcome
READY FOR REHEARSAL / PARTIAL / BLOCKED
\`\`\`

Only declare \`READY FOR REHEARSAL\` when all required contracts, health gates, reset checks, and integration acceptance items pass.`;

export function getIntegrateSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-integrate',
    description: 'Integrate prototype repositories, services, and devices against their contracts and runbook.',
    instructions: INTEGRATE_INSTRUCTIONS,
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'acore2026', version: '1.0' },
  };
}

export function getOpsxIntegrateCommandTemplate(): CommandTemplate {
  return {
    name: 'OPSX: Integrate',
    description: 'Build and verify a prototype across repositories, services, and devices',
    category: 'Prototype',
    tags: ['prototype', 'integration', 'contracts'],
    content: INTEGRATE_INSTRUCTIONS,
  };
}
