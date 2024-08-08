import { createCommand } from 'commander';
import { name as bundlibCommandName, description, version } from '../../../package.json';
import { booleanOptions } from './options/boolean';
import { createFlags } from './options/flags';
import type { ProgramOptions } from './options/option-types';

export function handleCLI(action: (options: ProgramOptions) => void | Promise<void>): void {

  const program = createCommand();

  program
    .name(bundlibCommandName)
    .description(description)
    .version(version, createFlags('version'))
    .helpOption(createFlags('help'), 'display this help screen');

  booleanOptions.forEach(
    ({ flag, desc }) => {
      const flags = createFlags(flag);
      program.option(flags, desc);
    },
  );

  void program
    .action(() => {
      const options = program.opts<ProgramOptions>();
      void action(options);
    })
    .parseAsync(process.argv, { from: 'node' });

}
