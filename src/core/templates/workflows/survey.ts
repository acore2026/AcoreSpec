import type { SkillTemplate, CommandTemplate } from '../types.js';

const SURVEY_INSTRUCTIONS = `Survey a prototype before implementation or integration.

**Input**: A change name is optional. Infer it only when the conversation clearly identifies one; otherwise list changes with \`openspec list --json\` and ask the user to choose.

## 1. Load the prototype context

Run:

\`\`\`bash
openspec status --change "<name>" --json
openspec instructions apply --change "<name>" --json
\`\`\`

Read every available context file. For a \`prototype-driven\` change, prioritize \`brief.md\`, \`inventory.md\`, \`scenario.md\`, and \`contracts/\`. If the change uses another schema, survey what exists and state which prototype records are missing.

## 2. Inspect, do not assume

Inspect the repositories, environments, and devices named by the artifacts or placed in scope by the user.

For each software repository record:
- purpose in the demo
- team-built, substantially modified, or upstream
- current branch, commit, dirty state, and expected frozen version
- build, start, stop, reset, and health commands that actually exist
- config keys and secret sources, never secret values
- logs, metrics, tests, generated artifacts, and fallback

For each host or device record:
- OS, shell, access method, network attachment, required ports, and clock assumptions
- runtime dependencies, model/image/package versions, health check, and operator
- physical safety boundary, emergency stop or manual takeover where relevant
- mock or replacement path

Use read-only checks by default. Do not install packages, start services, move devices, change branches, or edit other repositories during survey.

## 3. Reconcile the inventory

Compare observed state with the inventory and scenario. Report:
- \`MATCH\`: observed and declared state agree
- \`DRIFT\`: version, command, port, contract, or ownership differs
- \`MISSING\`: a required participant or command is not documented
- \`BLOCKED\`: access or evidence is unavailable

Treat an upstream fork as a dependency unless there is evidence of substantial team modification. Do not count it as team delivery merely because it is hosted in the same account.

## 4. Protect sensitive information

- Never print tokens, passwords, private keys, certificates, cookies, or \`.env\` contents.
- Refer to a secret by variable name or store location only.
- Do not copy private repository details into a public change artifact without the user's explicit intent.
- Preserve all existing working-tree changes.

## 5. Return a useful survey

Provide:

\`\`\`markdown
## Prototype survey: <change>

### Coverage
<repositories, environments, devices inspected vs declared>

### Drift and gaps
| Severity | Component | Finding | Evidence | Required action |

### Readiness
| Area | Ready / At risk / Blocked | Reason |

### Inventory updates
<specific edits recommended for inventory.md; apply them only when the request authorizes artifact updates>
\`\`\`

Do not use vague readiness statements. Every risk must name the component, evidence, and next action.`;

export function getSurveySkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-survey',
    description: 'Survey repositories, environments, devices, and readiness for a prototype change before implementation or integration.',
    instructions: SURVEY_INSTRUCTIONS,
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'acore2026', version: '1.0' },
  };
}

export function getOpsxSurveyCommandTemplate(): CommandTemplate {
  return {
    name: 'OPSX: Survey',
    description: 'Survey prototype repositories, environments, devices, and readiness',
    category: 'Prototype',
    tags: ['prototype', 'inventory', 'readiness'],
    content: SURVEY_INSTRUCTIONS,
  };
}
