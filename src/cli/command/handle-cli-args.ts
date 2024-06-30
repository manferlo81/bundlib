import { createCommand } from 'commander';
import { name as bundlibCommandName, description, version } from '../../../package.json';
import { BooleanProgramOptions } from './types/boolean-options';
import { booleanOptionDescMap, booleanOptions } from './options/boolean';
import { createFlags } from './options/flags';

type ProgramOptions = BooleanProgramOptions;

export function handleCLI(action: (options: ProgramOptions) => void) {

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
      const options = program.opts<ProgramOptions>();
      action(options);
    })
    .parseAsync();

}
