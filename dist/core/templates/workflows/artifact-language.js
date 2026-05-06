export const NEW_ARTIFACT_LANGUAGE_GUIDANCE = `**Artifact Language**

- Detect the primary natural language of the user's change request before creating artifacts.
- If the request is primarily Chinese, write human-facing artifact prose in Chinese.
- If the request is primarily English, write human-facing artifact prose in English.
- For mixed-language requests, follow the primary natural-language prose while preserving technical terms exactly.
- Always preserve code identifiers, command names, package names, file paths, API names, and proper nouns exactly.
- Keep machine-readable OpenSpec structural markers in canonical English, including:
  - \`## ADDED Requirements\`
  - \`## MODIFIED Requirements\`
  - \`## REMOVED Requirements\`
  - \`## RENAMED Requirements\`
  - \`### Requirement:\`
  - \`#### Scenario:\`
  - \`FROM:\` and \`TO:\` rename lines
- Localized requirement names, descriptions, scenario names, and scenario prose are allowed inside those canonical markers.
- Do not replace canonical markers with localized aliases such as Chinese translations of "Requirement" or "Scenario"; that requires separate parser/schema alias support.`;
export const CONTINUE_ARTIFACT_LANGUAGE_GUIDANCE = `**Artifact Language**

- Before writing the next artifact, inspect completed dependency artifacts for their human-facing language.
- If existing artifacts use a clear language, write the next artifact in that same language, even if the latest command text uses another language.
- If there are no completed artifacts yet, detect the primary natural language of the user's change request.
- If the request is primarily Chinese, write human-facing artifact prose in Chinese.
- If the request is primarily English, write human-facing artifact prose in English.
- If existing artifacts are mixed or the language choice is unclear, ask the user which artifact language to use before writing.
- For mixed-language requests, follow the primary natural-language prose while preserving technical terms exactly.
- Always preserve code identifiers, command names, package names, file paths, API names, and proper nouns exactly.
- Keep machine-readable OpenSpec structural markers in canonical English, including:
  - \`## ADDED Requirements\`
  - \`## MODIFIED Requirements\`
  - \`## REMOVED Requirements\`
  - \`## RENAMED Requirements\`
  - \`### Requirement:\`
  - \`#### Scenario:\`
  - \`FROM:\` and \`TO:\` rename lines
- Localized requirement names, descriptions, scenario names, and scenario prose are allowed inside those canonical markers.
- Do not replace canonical markers with localized aliases such as Chinese translations of "Requirement" or "Scenario"; that requires separate parser/schema alias support.`;
//# sourceMappingURL=artifact-language.js.map