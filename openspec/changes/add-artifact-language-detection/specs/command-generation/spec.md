## ADDED Requirements

### Requirement: Shared Command Body Artifact Language Guidance
Generated OPSX command bodies SHALL include shared artifact language guidance for workflows that create or update OpenSpec artifacts.

#### Scenario: Propose command includes language guidance
- **WHEN** generating the `propose` command body for any supported tool
- **THEN** the command body SHALL instruct agents to detect the user's request language before creating artifacts
- **AND** write human-facing artifact prose in that language
- **AND** preserve canonical OpenSpec structural markers and technical identifiers

#### Scenario: Continue command includes existing-language guidance
- **WHEN** generating the `continue` command body for any supported tool
- **THEN** the command body SHALL instruct agents to inspect completed dependency artifacts for language before writing the next artifact
- **AND** match the existing artifact language when it is clear

#### Scenario: Command guidance is tool-agnostic
- **WHEN** generating OPSX commands for different tools
- **THEN** artifact language guidance SHALL be present in shared command body content
- **AND** tool adapters SHALL only affect frontmatter and file path formatting

### Requirement: Skill Template Artifact Language Guidance
Generated skill templates SHALL include artifact language guidance for skills that create or update OpenSpec artifacts.

#### Scenario: Artifact-creating skills include guidance
- **WHEN** generating skills for `openspec-propose`, `openspec-new-change`, or `openspec-continue-change`
- **THEN** each skill SHALL include the same artifact language rules as its corresponding command body
- **AND** the rules SHALL appear near artifact creation guidance so agents apply them before writing files
