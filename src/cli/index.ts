#!/usr/bin/env node

import program from 'commander';
import { displayName, name, version } from '../../package.json';
import { action } from './action';

void program
  .version(version, '-v, --version')
  .name(name)
  .option('-d, --dev', 'create development builds')
  .option('-w, --watch', 'run bundlib in watch mode')
  .option('-s, --silent', 'prevent messages from showing in the console')
  .action(async () => {
    const { dev, watch, silent } = program;
    await action(displayName, version, dev, watch, silent);
  })
  .parseAsync(process.argv);
