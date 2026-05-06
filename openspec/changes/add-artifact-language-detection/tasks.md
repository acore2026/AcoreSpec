## 1. Template Guidance

- [x] 1.1 Add a shared artifact language guidance block or equivalent reusable wording for generated OPSX skills and commands
- [x] 1.2 Update `openspec-propose` skill and command templates to apply artifact language guidance before writing artifacts
- [x] 1.3 Update `openspec-new-change` skill and command templates to explain language detection for the initiating request
- [x] 1.4 Update `openspec-continue-change` skill and command templates to match completed dependency artifact language before writing the next artifact

## 2. Parser-Safe Spec Guidance

- [x] 2.1 Ensure guidance preserves canonical OpenSpec structural markers in English
- [x] 2.2 Ensure guidance allows localized requirement names, descriptions, scenario names, and scenario prose
- [x] 2.3 Ensure guidance preserves code identifiers, command names, package names, file paths, API names, and proper nouns

## 3. Documentation

- [x] 3.1 Update agent instruction documentation to describe artifact language behavior
- [x] 3.2 Add examples showing Chinese prose inside canonical OpenSpec headings
- [x] 3.3 Clarify that localized structural marker aliases are out of scope until parser/schema alias support exists

## 4. Tests

- [x] 4.1 Add template generation tests confirming propose/new/continue skills include artifact language guidance
- [x] 4.2 Add command generation tests confirming shared command bodies include artifact language guidance across tool adapters
- [x] 4.3 Add tests or snapshots confirming canonical marker preservation guidance is present
- [x] 4.4 Add regression coverage for continuation guidance that prioritizes existing artifact language

## 5. Verification

- [x] 5.1 Run focused template and command generation tests
- [x] 5.2 Run `pnpm run build`
- [ ] 5.3 Run `pnpm test`
- [x] 5.4 Run `pnpm lint`
- [x] 5.5 Run `openspec validate add-artifact-language-detection`
