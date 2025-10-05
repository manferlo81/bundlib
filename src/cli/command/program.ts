import type { Command } from 'commander';
import { createCommand } from 'commander';
import { name as bundlibCommandName, description, version } from '../../../package.json';
import { booleanOptions } from './options/boolean';
import { createFlags } from './tools/flags';
import type { ProgramOptions } from './types/cli-options';
import type { ProgramAction } from './types/program';

export function createProgram() {
  const program = createCommand();

  program
    .name(bundlibCommandName)
    .description(description)
    .version(version, createFlags('version', 'v'))
    .helpOption(createFlags('help', 'h'), 'display this help screen');

  booleanOptions.forEach(
    ({ flag, short, desc }) => {
      program.option(createFlags(flag, short), desc);
    },
  );

  return program;
}

export const getProgramOptions = (program: Command) => program.opts<ProgramOptions>();

export function setCommandAction(command: Command, action: ProgramAction, program: Command): void {
  command.action(() => {
    void action(getProgramOptions(program));
  });
}

export function registerCommand(parent: Command, commandName: string, desc: string, action: ProgramAction): void {
  setCommandAction(
    parent.command(commandName).description(desc),
    action,
    parent,
  );
}
