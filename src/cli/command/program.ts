import type { Command } from 'commander';
import { createCommand } from 'commander';
import { name as bundlibCommandName, description, version } from '../../../package.json';
import { booleanOptions } from './options/boolean';
import { createFlags } from './options/flags';
import type { ActionWithOptions, ProgramOptions } from './options/option-types';

export function createProgram() {
  const program = createCommand();

  program
    .name(bundlibCommandName)
    .description(description)
    .version(version, createFlags('version'))
    .helpOption(createFlags('help'), 'display this help screen');

  booleanOptions.forEach(
    ({ flag, desc }) => {
      program.option(createFlags(flag), desc);
    },
  );

  return program;
}

export const getProgramOptions = (program: Command) => program.opts<ProgramOptions>();

export function setCommandAction(command: Command, action: ActionWithOptions, program: Command): void {
  command.action(() => {
    void action(getProgramOptions(program));
  });
}

export function registerCommand(parent: Command, commandName: string, desc: string, action: ActionWithOptions): void {
  setCommandAction(
    parent.command(commandName).description(desc),
    action,
    parent,
  );
}
