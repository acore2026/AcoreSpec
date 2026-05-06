import { describe, expect, it } from 'vitest';

import { generateCommand } from '../../../src/core/command-generation/generator.js';
import { claudeAdapter } from '../../../src/core/command-generation/adapters/claude.js';
import { cursorAdapter } from '../../../src/core/command-generation/adapters/cursor.js';
import { getCommandContents } from '../../../src/core/shared/skill-generation.js';
import {
  getContinueChangeSkillTemplate,
  getNewChangeSkillTemplate,
  getOpsxContinueCommandTemplate,
  getOpsxNewCommandTemplate,
  getOpsxProposeCommandTemplate,
  getOpsxProposeSkillTemplate,
} from '../../../src/core/templates/skill-templates.js';

const REQUIRED_MARKER_GUIDANCE = [
  '## ADDED Requirements',
  '## MODIFIED Requirements',
  '## REMOVED Requirements',
  '## RENAMED Requirements',
  '### Requirement:',
  '#### Scenario:',
  'FROM:',
  'TO:',
];

function expectNewArtifactLanguageGuidance(content: string): void {
  expect(content).toContain('**Artifact Language**');
  expect(content).toContain('If the request is primarily Chinese');
  expect(content).toContain('If the request is primarily English');
  expect(content).toContain('primary natural language of the user');
  expect(content).toContain('write human-facing artifact prose');
  expect(content).toContain('code identifiers, command names, package names, file paths, API names');
  expect(content).toContain('Localized requirement names, descriptions, scenario names, and scenario prose are allowed');
  expect(content).toContain('Do not replace canonical markers with localized aliases');

  for (const marker of REQUIRED_MARKER_GUIDANCE) {
    expect(content).toContain(marker);
  }
}

function expectContinueArtifactLanguageGuidance(content: string): void {
  expectNewArtifactLanguageGuidance(content);
  expect(content).toContain('inspect completed dependency artifacts');
  expect(content).toContain('write the next artifact in that same language');
  expect(content).toContain('even if the latest command text uses another language');
  expect(content).toContain('ask the user which artifact language to use before writing');
}

describe('artifact language guidance templates', () => {
  it('includes language guidance in artifact-creating skill templates', () => {
    expectNewArtifactLanguageGuidance(getOpsxProposeSkillTemplate().instructions);
    expectNewArtifactLanguageGuidance(getNewChangeSkillTemplate().instructions);
    expectContinueArtifactLanguageGuidance(getContinueChangeSkillTemplate().instructions);
  });

  it('includes language guidance in shared command bodies', () => {
    expectNewArtifactLanguageGuidance(getOpsxProposeCommandTemplate().content);
    expectNewArtifactLanguageGuidance(getOpsxNewCommandTemplate().content);
    expectContinueArtifactLanguageGuidance(getOpsxContinueCommandTemplate().content);
  });

  it('preserves language guidance through different command adapters', () => {
    const propose = getCommandContents(['propose'])[0];
    const continueCommand = getCommandContents(['continue'])[0];

    const claudePropose = generateCommand(propose, claudeAdapter);
    const cursorPropose = generateCommand(propose, cursorAdapter);
    const claudeContinue = generateCommand(continueCommand, claudeAdapter);

    expectNewArtifactLanguageGuidance(claudePropose.fileContent);
    expectNewArtifactLanguageGuidance(cursorPropose.fileContent);
    expectContinueArtifactLanguageGuidance(claudeContinue.fileContent);
  });
});
