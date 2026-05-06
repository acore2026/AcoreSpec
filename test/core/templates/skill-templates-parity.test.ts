import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import {
  type SkillTemplate,
  getApplyChangeSkillTemplate,
  getArchiveChangeSkillTemplate,
  getBulkArchiveChangeSkillTemplate,
  getContinueChangeSkillTemplate,
  getExploreSkillTemplate,
  getFeedbackSkillTemplate,
  getFfChangeSkillTemplate,
  getNewChangeSkillTemplate,
  getOnboardSkillTemplate,
  getOpsxApplyCommandTemplate,
  getOpsxArchiveCommandTemplate,
  getOpsxBulkArchiveCommandTemplate,
  getOpsxContinueCommandTemplate,
  getOpsxExploreCommandTemplate,
  getOpsxFfCommandTemplate,
  getOpsxNewCommandTemplate,
  getOpsxOnboardCommandTemplate,
  getOpsxSyncCommandTemplate,
  getOpsxProposeCommandTemplate,
  getOpsxProposeSkillTemplate,
  getOpsxVerifyCommandTemplate,
  getSyncSpecsSkillTemplate,
  getVerifyChangeSkillTemplate,
} from '../../../src/core/templates/skill-templates.js';
import { generateSkillContent } from '../../../src/core/shared/skill-generation.js';

const EXPECTED_FUNCTION_HASHES: Record<string, string> = {
  getExploreSkillTemplate: '3f73b4d7ab189ef6367fccc9d99308bee35c6a89dae4c8044582a01cb01b335b',
  getNewChangeSkillTemplate: '4967ff103e0bcad685969937a855d112f7010a367706cd92faad9abb87ed1bd7',
  getContinueChangeSkillTemplate: '0f0ad4810fb7b959b06f898f725fa8bb718c5cdbbfd052b67109eb76c4263310',
  getApplyChangeSkillTemplate: '6238712ba8cd2fd099c4f3bac13436f758fc6ac776fb8be19547f2b195240bfd',
  getFfChangeSkillTemplate: 'a7332fb14c8dc3f9dec71f5d332790b4a8488191e7db4ab6132ccbefecf9ded9',
  getSyncSpecsSkillTemplate: 'bded184e4c345619148de2c0ad80a5b527d4ffe45c87cc785889b9329e0f465b',
  getOnboardSkillTemplate: 'c9e719a02d2ae7f74a0e978f9ad4e767c1921248a9e3724c3321c58a15c38ba9',
  getOpsxExploreCommandTemplate: 'b421b88c7a532385f7b1404736d7893eb35a05573b4a04a96f72379ac1bbf148',
  getOpsxNewCommandTemplate: 'c085060ac40ff2b04609223d0a5c5a81f9ed244cf9990c1f0522818abce4548f',
  getOpsxContinueCommandTemplate: '32aafad04939618a21e83e0bb94c37711ad1605feb1f079438b9f524985bf2b0',
  getOpsxApplyCommandTemplate: 'f59cfe9482a1b29f64b9cd7396397991a2f00a5cb1abde4ab8b4757acf1678b9',
  getOpsxFfCommandTemplate: 'cdebe872cc8e0fcc25c8864b98ffd66a93484c0657db94bd1285b8113092702a',
  getArchiveChangeSkillTemplate: '6f8ca383fdb5a4eb9872aca81e07bf0ba7f25e4de8617d7a047ca914ca7f14b9',
  getBulkArchiveChangeSkillTemplate: '8049897ce1ddb2ff6c0d4b72e22636f9ecfd083b5f2c2a30cf3bb1cb828a2f93',
  getOpsxSyncCommandTemplate: '378d035fe7cc30be3e027b66dcc4b8afc78ef1c8369c39479c9b05a582fb5ccf',
  getVerifyChangeSkillTemplate: '40dde29051a0ba204295b74e49e87b6e9ff30c8b89ff0e791b4f955b4595de59',
  getOpsxArchiveCommandTemplate: 'b44cc9748109f61687f9f596604b037bc3ea803abc143b22f09a76aebd98b493',
  getOpsxOnboardCommandTemplate: 'fce531f952e939ee85a41848fc21e4cc720b0f3eb62737adc3a51ee6ad2dfc57',
  getOpsxBulkArchiveCommandTemplate: '0d77c82de43840a28c74f5181cb21e33b9a9d00454adf4bc92bdc9e69817d6f5',
  getOpsxVerifyCommandTemplate: 'd7c0444863faabb16abb091bc40ee56d985ae4bfa9a4db1e622ca8ba03c32fed',
  getOpsxProposeSkillTemplate: 'f861d14169e2b1751a5b5b045da8d8ff31b39bb6cec71090b996c3c40631918b',
  getOpsxProposeCommandTemplate: '4c4dad369a6929239a62fe9b000a62040eec37ec33fd480ee8864a892035ba94',
  getFeedbackSkillTemplate: 'd7d83c5f7fc2b92fe8f4588a5bf2d9cb315e4c73ec19bcd5ef28270906319a0d',
};

const EXPECTED_GENERATED_SKILL_CONTENT_HASHES: Record<string, string> = {
  'openspec-explore': '08e1ec9958eb04653707dd3e198c3fd69cf1b3acd3cf95a1022693cca83c60fc',
  'openspec-new-change': '5d73d7b64c1e683faf46449a11a23be9fde28abb875065bba7438b2b5d7f29d1',
  'openspec-continue-change': 'bd4eb3a4197c95702c55af2ef4136fe8698fd4258fc56621a49a0652d03d1b60',
  'openspec-apply-change': '38ad2cb645827eda555f20e1ac9d483e1d75bae4c817c0669474aaa8c12c0421',
  'openspec-ff-change': '672c3a5b8df152d959b15bd7ae2be7a75ab7b8eaa2ec1e0daa15c02479b27937',
  'openspec-sync-specs': 'b8859cf454379a19ca35dbf59eedca67306607f44a355327f9dc851114e50bde',
  'openspec-archive-change': 'f83c85452bd47de0dee6b8efbcea6a62534f8a175480e9044f3043f887cebf0f',
  'openspec-bulk-archive-change': '10477399bb07c7ba67f78e315bd68fb1901af8866720545baf4c62a6a679493b',
  'openspec-verify-change': 'b6dc1b87940be9d6125b834831c8619019aec9a9748995f72bf981b6f08b67f8',
  'openspec-onboard': 'c1444e026028210efd699110f7e9079bcb486d85ccf27f743213a81cb1084303',
  'openspec-propose': '2d6dc1a1103a84a15d7a13e16ae80e7730491df6aec31831af779ce873a5a198',
};

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`);

    return `{${entries.join(',')}}`;
  }

  return JSON.stringify(value);
}

function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

describe('skill templates split parity', () => {
  it('preserves all template function payloads exactly', () => {
    const functionFactories: Record<string, () => unknown> = {
      getExploreSkillTemplate,
      getNewChangeSkillTemplate,
      getContinueChangeSkillTemplate,
      getApplyChangeSkillTemplate,
      getFfChangeSkillTemplate,
      getSyncSpecsSkillTemplate,
      getOnboardSkillTemplate,
      getOpsxExploreCommandTemplate,
      getOpsxNewCommandTemplate,
      getOpsxContinueCommandTemplate,
      getOpsxApplyCommandTemplate,
      getOpsxFfCommandTemplate,
      getArchiveChangeSkillTemplate,
      getBulkArchiveChangeSkillTemplate,
      getOpsxSyncCommandTemplate,
      getVerifyChangeSkillTemplate,
      getOpsxArchiveCommandTemplate,
      getOpsxOnboardCommandTemplate,
      getOpsxBulkArchiveCommandTemplate,
      getOpsxVerifyCommandTemplate,
      getOpsxProposeSkillTemplate,
      getOpsxProposeCommandTemplate,
      getFeedbackSkillTemplate,
    };

    const actualHashes = Object.fromEntries(
      Object.entries(functionFactories).map(([name, fn]) => [name, hash(stableStringify(fn()))])
    );

    expect(actualHashes).toEqual(EXPECTED_FUNCTION_HASHES);
  });

  it('preserves generated skill file content exactly', () => {
    // Intentionally excludes getFeedbackSkillTemplate: skillFactories only models templates
    // deployed via generateSkillContent, while feedback is covered in function payload parity.
    const skillFactories: Array<[string, () => SkillTemplate]> = [
      ['openspec-explore', getExploreSkillTemplate],
      ['openspec-new-change', getNewChangeSkillTemplate],
      ['openspec-continue-change', getContinueChangeSkillTemplate],
      ['openspec-apply-change', getApplyChangeSkillTemplate],
      ['openspec-ff-change', getFfChangeSkillTemplate],
      ['openspec-sync-specs', getSyncSpecsSkillTemplate],
      ['openspec-archive-change', getArchiveChangeSkillTemplate],
      ['openspec-bulk-archive-change', getBulkArchiveChangeSkillTemplate],
      ['openspec-verify-change', getVerifyChangeSkillTemplate],
      ['openspec-onboard', getOnboardSkillTemplate],
      ['openspec-propose', getOpsxProposeSkillTemplate],
    ];

    const actualHashes = Object.fromEntries(
      skillFactories.map(([dirName, createTemplate]) => [
        dirName,
        hash(generateSkillContent(createTemplate(), 'PARITY-BASELINE')),
      ])
    );

    expect(actualHashes).toEqual(EXPECTED_GENERATED_SKILL_CONTENT_HASHES);
  });
});
