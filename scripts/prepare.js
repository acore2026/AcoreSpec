#!/usr/bin/env node

import { execFileSync } from 'child_process';
import { existsSync } from 'fs';

if (existsSync('dist/cli/index.js')) {
  console.log('Using existing dist output.');
  process.exit(0);
}

execFileSync(process.execPath, ['build.js'], { stdio: 'inherit' });
