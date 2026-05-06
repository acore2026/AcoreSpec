## ADDED Requirements

### Requirement: Artifact Language Selection
Artifact creation workflows SHALL select a documentation language from the user's request and existing change artifacts.

#### Scenario: New change uses request language
- **WHEN** an agent creates artifacts for a newly scaffolded change
- **AND** the initiating request is primarily Chinese
- **THEN** the generated human-facing artifact prose SHALL be Chinese
- **AND** the artifact SHALL preserve canonical OpenSpec structural markers in English

#### Scenario: English new change remains English
- **WHEN** an agent creates artifacts for a newly scaffolded change
- **AND** the initiating request is primarily English
- **THEN** the generated human-facing artifact prose SHALL be English

#### Scenario: Continued change matches existing artifacts
- **WHEN** an agent continues an existing change
- **AND** completed dependency artifacts already use a clear human language
- **THEN** the next generated artifact SHALL use the same human language
- **AND** this existing artifact language SHALL take precedence over the language of the latest command text

#### Scenario: Mixed language request preserves technical terms
- **WHEN** the user's request mixes Chinese prose with English technical terms
- **THEN** the generated artifact prose SHALL follow the primary natural language of the request
- **AND** keep technical identifiers, code symbols, command names, and file paths in their original spelling

#### Scenario: Ambiguous language asks before writing
- **WHEN** the request language and existing artifact language conflict or cannot be determined
- **THEN** the agent SHALL ask the user which artifact language to use before writing a new artifact

### Requirement: Parser-Safe Localized Specs
Artifact workflows SHALL distinguish localizable prose from machine-readable OpenSpec syntax.

#### Scenario: Localized spec content keeps canonical headings
- **WHEN** an agent writes a spec artifact in Chinese
- **THEN** the spec SHALL use canonical English section markers required by OpenSpec parsers
- **AND** requirement names, requirement descriptions, scenario names, and scenario steps MAY be written in Chinese

#### Scenario: Localized marker aliases are out of scope
- **WHEN** an agent writes artifact docs under this workflow
- **THEN** it SHALL NOT replace canonical markers with localized aliases such as Chinese translations of `Requirement` or `Scenario`
- **AND** full marker localization SHALL require a separate parser/schema alias capability
