import type { Command } from 'commander';
import { createCommand as createCommanderCommand } from 'commander';
import { name as bundlibCommandName, description, version } from '../../../package.json';
import { booleanOptions } from './options/boolean';
import { createFlags } from './tools/flags';
import type { ProgramOptions } from './types/cli-options';
import type { ProgramAction } from './types/program';

export function createProgram(): Command {

  // Create Commander program
  const program = createCommanderCommand();

  // Declare name, descriptions and version of the main command
  program
    .name(bundlibCommandName)
    .description(description)
    .version(version, createFlags('version', 'v'))
    .helpOption(createFlags('help', 'h'), 'display this help screen');

  // Declare program options
  booleanOptions.forEach(
    ({ flag, short, desc }) => {
      program.option(createFlags(flag, short), desc);
    },
  );

  // Return program
  return program;
}

export const getProgramOptions = (program: Command) => program.opts<ProgramOptions>();

export function setCommandAction<C extends Command>(command: C, action: ProgramAction, program: Command): C {
  return command.action(async () => {
    await action(getProgramOptions(program));
  });
}

export function createCommand(parent: Command, commandName: string, desc: string): Command {
  return parent.command(commandName).description(desc);
}

export function registerCommand(parent: Command, commandName: string, desc: string, action: ProgramAction): Command {
  return setCommandAction(
    createCommand(parent, commandName, desc),
    action,
    parent,
  );
}
