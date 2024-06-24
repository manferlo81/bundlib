#!/usr/bin/env node

import { program } from 'commander';
import { name as bundlibCommandName, displayName, version } from '../../package.json';
import { action } from './action';

type BooleanOptionNameOrder = ['dev', 'watch', 'silent'];
type BooleanOptionNames = BooleanOptionNameOrder[number];

type ProgramOptions = Record<BooleanOptionNames, boolean>;

function createFlags(flag: string, shortFlag: string): string {
  return [`-${shortFlag}`, `--${flag}`].join(', ');
}

const booleanOptions: BooleanOptionNameOrder = ['dev', 'watch', 'silent'];

const shortOptionMap: Record<BooleanOptionNames, string> = {
  dev: 'd',
  watch: 'w',
  silent: 's',
};

const map: Record<BooleanOptionNames, string> = {
  dev: 'create development builds',
  watch: 'run bundlib in watch mode',
  silent: 'prevent messages from showing in the console',
};

program
  .version(version, createFlags('version', 'v'))
  .name(bundlibCommandName)
  .helpOption(createFlags('help', 'h'), 'display this help screen');

booleanOptions.forEach(
  (flag) => {
    const shortFlag = shortOptionMap[flag];
    const flags = createFlags(flag, shortFlag);
    const desc = map[flag];
    program.option(flags, desc);
  },
);

void program
  .action(async () => {
    const { dev, watch, silent } = program.opts<ProgramOptions>();
    await action(displayName, version, dev, watch, silent);
  })
  .parseAsync(process.argv);
