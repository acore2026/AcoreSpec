## Why

Teams that work primarily in Chinese can describe OpenSpec changes in Chinese, but generated proposal, design, spec, and task artifacts currently tend to follow the English project defaults. This creates friction for teams whose implementation discussion happens in Chinese while still needing parser-safe OpenSpec structure.

## What Changes

- Add artifact language behavior so generated human-facing artifact prose follows the user's change request language.
- Preserve machine-readable OpenSpec structural markers in canonical English until localized marker aliases are explicitly supported.
- Make continuation behavior language-aware by matching the existing artifact language for an in-progress change.
- Clarify mixed-language handling so code identifiers, file paths, command names, package names, API names, and OpenSpec marker syntax are preserved exactly.

## Capabilities

### New Capabilities

### Modified Capabilities

- `docs-agent-instructions`: Generated agent instructions guide artifact writers to detect and preserve artifact language.
- `cli-artifact-workflow`: Artifact creation workflows define language selection behavior for new and continued changes.
- `command-generation`: Generated skill and command surfaces include artifact language guidance.

## Impact

- Affected generated workflow templates under `src/core/templates/workflows/`.
- Affected instruction and template generation paths that produce AI-facing guidance.
- Affected OpenSpec docs that explain artifact creation behavior.
- Tests should cover Chinese, English, mixed-language, and existing-artifact continuation scenarios.
