import { describe, expect, it } from 'vitest';
import {
  getDemoSkillTemplate,
  getIntegrateSkillTemplate,
  getOpsxDemoCommandTemplate,
  getOpsxIntegrateCommandTemplate,
  getOpsxRehearseCommandTemplate,
  getOpsxSurveyCommandTemplate,
  getRehearseSkillTemplate,
  getSurveySkillTemplate,
} from '../../../src/core/templates/skill-templates.js';

describe('prototype action templates', () => {
  it('keeps skill and command bodies identical', () => {
    expect(getSurveySkillTemplate().instructions).toBe(getOpsxSurveyCommandTemplate().content);
    expect(getIntegrateSkillTemplate().instructions).toBe(getOpsxIntegrateCommandTemplate().content);
    expect(getRehearseSkillTemplate().instructions).toBe(getOpsxRehearseCommandTemplate().content);
    expect(getDemoSkillTemplate().instructions).toBe(getOpsxDemoCommandTemplate().content);
  });

  it('protects private data and existing repository work during survey and integration', () => {
    const survey = getSurveySkillTemplate().instructions;
    const integrate = getIntegrateSkillTemplate().instructions;

    expect(survey).toContain('Never print tokens');
    expect(survey).toContain('Do not install packages');
    expect(integrate).toContain('Preserve user changes');
    expect(integrate).toContain('do not switch branches, reset, clean');
  });

  it('requires device safety and rehearsal evidence before a live demo', () => {
    const rehearse = getRehearseSkillTemplate().instructions;
    const demo = getDemoSkillTemplate().instructions;

    expect(rehearse).toContain('emergency stop or manual takeover');
    expect(rehearse).toContain('Do not trigger device movement');
    expect(demo).toContain('required rehearsal streak passed');
    expect(demo).toContain('do not announce readiness');
    expect(demo).toContain('Do not edit code');
  });
});
