import { createCommand } from 'commander';
import { name as bundlibCommandName, description, version } from '../../../package.json';
import { greenBright } from '../tools/colors';
import { logInfo, logWarning } from '../tools/console';
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
      program.option(createFlags(flag), desc);
    },
  );

  const buildAction = async () => {

    // get all options
    const opts = program.opts<ProgramOptions>();

    // warn if `watch` options is being used
    if (opts.watch) {
      logWarning(`Using the ${greenBright('--watch, -w')} option is deprecated. Please use the ${greenBright('watch')} command to run in watch mode.`);
      logInfo('');
    }

    // call action
    await action(opts);

  };

  const watchAction = async () => {

    // get all options
    const opts = program.opts<ProgramOptions>();

    // warn if `watch` options is being used
    if (opts.watch) {
      logWarning(`You are using the deprecated ${greenBright('--watch, -w')} option on the ${greenBright('watch')} command. We'll ignore it this time but this will fail in the future.`);
      logInfo('');
    }

    // force `dev` and `watch` options
    const devOptions: ProgramOptions = { dev: true, ...opts, watch: true };

    // call action
    await action(devOptions);
  };

  program
    .command('build')
    .description('Build your library for production')
    .action(buildAction);

  program
    .command('watch')
    .description('Starts Bundlib in watch mode')
    .action(watchAction);

  program.action(buildAction);

  void program.parseAsync(process.argv, { from: 'node' });

}
