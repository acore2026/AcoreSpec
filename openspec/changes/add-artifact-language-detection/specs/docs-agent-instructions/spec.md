## ADDED Requirements

### Requirement: Artifact Language Guidance
Generated agent instruction docs SHALL tell agents to write human-facing OpenSpec artifact prose in the user's working language while preserving parser-safe structural syntax.

#### Scenario: Chinese request produces Chinese artifact prose
- **WHEN** `openspec/AGENTS.md` or generated skill guidance explains artifact creation
- **AND** the user's change request is primarily Chinese
- **THEN** the guidance SHALL instruct agents to write proposal, design, spec, and task prose in Chinese
- **AND** preserve code identifiers, file paths, command names, package names, API names, and OpenSpec structural markers exactly

#### Scenario: English request produces English artifact prose
- **WHEN** `openspec/AGENTS.md` or generated skill guidance explains artifact creation
- **AND** the user's change request is primarily English
- **THEN** the guidance SHALL instruct agents to write proposal, design, spec, and task prose in English

#### Scenario: Canonical markers remain parser-safe
- **WHEN** guidance shows localized artifact examples
- **THEN** the Markdown structure SHALL keep canonical markers such as `## ADDED Requirements`, `### Requirement:`, and `#### Scenario:`
- **AND** localized text SHALL appear in titles, descriptions, and scenario prose rather than replacing those markers
