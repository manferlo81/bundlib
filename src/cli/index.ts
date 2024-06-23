#!/usr/bin/env node

import { program } from 'commander';
import { displayName, name as libraryName, version as libraryVersion } from '../../package.json';
import { action } from './action';

void program
  .version(libraryVersion, '-v, --version')
  .name(libraryName)
  .helpOption('-h, --help', 'Display this help screen')
  .option('-d, --dev', 'create development builds')
  .option('-w, --watch', 'run bundlib in watch mode')
  .option('-s, --silent', 'prevent messages from showing in the console')
  .action(async () => {
    const { dev, watch, silent } = program.opts<{ dev: boolean; watch: boolean; silent: boolean }>();
    await action(displayName, libraryVersion, dev, watch, silent);
  })
  .parseAsync(process.argv);
