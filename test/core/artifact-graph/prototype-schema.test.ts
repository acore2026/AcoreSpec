import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import {
  ArtifactGraph,
  detectCompleted,
  loadTemplate,
  resolveSchema,
} from '../../../src/core/artifact-graph/index.js';
import { generateApplyInstructions } from '../../../src/commands/workflow/instructions.js';

describe('prototype-driven schema', () => {
  let projectRoot: string;
  let changeDir: string;

  beforeEach(() => {
    projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'openspec-prototype-schema-'));
    changeDir = path.join(projectRoot, 'openspec', 'changes', 'device-demo');
    fs.mkdirSync(changeDir, { recursive: true });
    fs.writeFileSync(
      path.join(changeDir, '.openspec.yaml'),
      'schema: prototype-driven\ncreated: 2026-07-27\n',
    );
  });

  afterEach(() => {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  });

  it('defines the complete prototype artifact graph', () => {
    const schema = resolveSchema('prototype-driven');
    const graph = ArtifactGraph.fromSchema(schema);

    expect(graph.getAllArtifacts().map((artifact) => artifact.id)).toEqual([
      'brief',
      'inventory',
      'scenario',
      'contracts',
      'design',
      'runbook',
      'acceptance',
      'tasks',
    ]);
    expect(graph.getBuildOrder()).toEqual([
      'brief',
      'inventory',
      'scenario',
      'contracts',
      'design',
      'runbook',
      'acceptance',
      'tasks',
    ]);
    expect(schema.apply).toEqual(expect.objectContaining({
      requires: ['tasks'],
      tracks: 'tasks.md',
    }));
  });

  it('loads cross-platform, safety, and evidence guidance from templates', () => {
    const inventory = loadTemplate('prototype-driven', 'inventory.md');
    const runbook = loadTemplate('prototype-driven', 'runbook.md');
    const acceptance = loadTemplate('prototype-driven', 'acceptance.md');

    expect(inventory).toContain('OS / shell');
    expect(inventory).toContain('Configuration and secrets');
    expect(runbook).toContain('Emergency stop / manual takeover');
    expect(runbook).toContain('Working directory');
    expect(acceptance).toContain('Evidence and project-relative destination');
    expect(acceptance).toContain('PASS');
    expect(acceptance).toContain('BLOCKED');
  });

  it('returns every prototype artifact as apply context', async () => {
    const files: Record<string, string> = {
      'brief.md': '# Brief\n',
      'inventory.md': '# Inventory\n',
      'scenario.md': '# Scenario\n',
      'design.md': '# Design\n',
      'runbook.md': '# Runbook\n',
      'acceptance.md': '# Acceptance\n',
      'tasks.md': '# Tasks\n\n- [ ] 1.1 Run integration\n',
    };
    for (const [relativePath, content] of Object.entries(files)) {
      fs.writeFileSync(path.join(changeDir, relativePath), content);
    }
    const contractsDir = path.join(changeDir, 'contracts');
    fs.mkdirSync(contractsDir, { recursive: true });
    fs.writeFileSync(path.join(contractsDir, 'device-to-core.md'), '# Contract\n');

    const schema = resolveSchema('prototype-driven');
    const completed = detectCompleted(ArtifactGraph.fromSchema(schema), changeDir);
    expect(completed.size).toBe(8);

    const instructions = await generateApplyInstructions(projectRoot, 'device-demo');
    expect(Object.keys(instructions.contextFiles)).toEqual([
      'brief',
      'inventory',
      'scenario',
      'contracts',
      'design',
      'runbook',
      'acceptance',
      'tasks',
    ]);
    expect(instructions.contextFiles.contracts[0]).toBe(
      path.join(changeDir, 'contracts', 'device-to-core.md'),
    );
  });
});
