#!/usr/bin/env node

import { createCommand } from 'commander';
import { name as bundlibCommandName, description, displayName, version } from '../../package.json';
import { action } from './action';
import { createFlags } from './options/flags';
import { booleanOptionDescMap, booleanOptions } from './options/boolean';
import { BooleanProgramOptions } from './types/boolean-options';

type ProgramOptions = BooleanProgramOptions;

const program = createCommand();

program
  .name(bundlibCommandName)
  .description(description)
  .version(version, createFlags('version'))
  .helpOption(createFlags('help'), 'display this help screen');

booleanOptions.forEach(
  (flag) => {
    const flags = createFlags(flag);
    const desc = booleanOptionDescMap[flag];
    program.option(flags, desc);
  },
);

void program
  .action(() => {
    const { dev, watch, silent } = program.opts<ProgramOptions>();
    void action(displayName, version, !!dev, !!watch, !!silent);
  })
  .parseAsync();
