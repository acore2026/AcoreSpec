## Context

OpenSpec artifacts are authored by AI agents using generated workflow skills and command bodies. The project and canonical OpenSpec syntax are English, but teams may write prompts and review artifacts in another language, especially Chinese.

Current parsers and archive logic recognize English structural markers such as `## ADDED Requirements`, `### Requirement:`, and `#### Scenario:`. Translating those markers would require parser/schema alias support and would risk breaking validation or archive behavior. Human-facing prose inside those structures can be localized safely.

## Goals / Non-Goals

**Goals:**

- Make artifact-writing guidance language-aware for Chinese and English user requests.
- Keep localized artifacts compatible with existing validation and archive parsing.
- Match existing artifact language when continuing a change.
- Keep technical identifiers stable across languages.
- Add guidance in shared template surfaces so all supported tools receive consistent behavior.

**Non-Goals:**

- Add parser support for localized structural marker aliases.
- Translate CLI output, command names, schemas, or source docs globally.
- Add an external language detection dependency.
- Auto-translate existing artifacts.

## Decisions

### Decision: Use instruction-level language detection first

Agents will detect the natural language from the user's request and from completed dependency artifacts. The implementation should express this as explicit guidance in generated workflow skills and command bodies rather than adding a runtime CLI language detector.

Alternatives considered:

- CLI-level detection: more deterministic, but the CLI does not write the artifact prose itself.
- Project-wide language setting: useful later, but too rigid for teams that may mix English and Chinese changes in the same repository.

### Decision: Preserve canonical OpenSpec markers

The language policy will localize prose only. Structural markers remain canonical English:

- `## ADDED Requirements`
- `## MODIFIED Requirements`
- `## REMOVED Requirements`
- `## RENAMED Requirements`
- `### Requirement:`
- `#### Scenario:`
- `FROM:` / `TO:` rename lines

This keeps validation, archive, and delta parsing compatible without parser changes.

### Decision: Existing artifact language wins during continuation

When continuing a change, completed dependency artifacts are stronger context than the latest command text. For example, if `proposal.md` is Chinese and the user types `/opsx:continue add-login`, the next artifact should remain Chinese.

If existing artifacts are mixed or unclear, the agent should ask before writing the next artifact.

### Decision: Keep technical terms unchanged

Guidance should tell agents to preserve code identifiers, package names, command names, file paths, API names, and user-provided proper nouns. This avoids corrupting implementation references and keeps review diffs precise.

## Risks / Trade-offs

Instruction adherence varies by model -> Keep the rule short, repeated near artifact creation steps, and include concrete examples.

Chinese prose with English markers may look partially localized -> Accept this for parser safety until localized marker aliases are designed.

Mixed-language detection can be ambiguous -> Prefer primary natural-language prose, and ask when existing artifact language conflicts with the latest request.

Multiple template surfaces may drift -> Define a shared wording block or helper constant if the current template structure allows it; otherwise update skill and command templates together with tests.

## Migration Plan

No data migration is required. Existing changes remain valid. After this change ships, regenerated skills and commands will include artifact language guidance, and future artifacts can follow the user's prompt language while preserving canonical OpenSpec syntax.

## Open Questions

- Should a future global config option allow teams to force an artifact language regardless of prompt language?
- Should localized structural marker aliases be handled by the existing `schema-alias-support` effort or by a dedicated parser localization change?
