import { createCommand } from 'commander';
import { name as bundlibCommandName, description, version } from '../../../package.json';
import { greenBright } from '../tools/colors';
import { logInfo, logWarning } from '../tools/console';
import { booleanOptions } from './options/boolean';
import { createFlags } from './options/flags';
import type { ProgramOptions } from './options/option-types';

function createProgram() {

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

export function handleCLI(action: (options: ProgramOptions) => void | Promise<void>): void {

  const program = createProgram();

  const buildAction = async (useWatchOption: boolean) => {

    // get all options
    const opts = program.opts<ProgramOptions>();

    // warn if `watch` options is being used
    if (opts.watch) {
      logWarning(`Using the ${greenBright('--watch, -w')} option is deprecated. Please use the ${greenBright('watch')} command to run in watch mode.`);
      logInfo('');
    }

    // remove `watch` option if necessary
    const buildOptions: ProgramOptions = useWatchOption ? opts : { ...opts, watch: false };

    // call action
    await action(buildOptions);

  };

  const watchAction = async () => {

    // get all options
    const opts = program.opts<ProgramOptions>();

    // warn if `watch` options is being used
    if (opts.watch) {
      logWarning(`You are using the deprecated ${greenBright('--watch, -w')} option on the ${greenBright('watch')} command. We'll ignore it this time but this will fail in the future.`);
      logInfo('');
    }

    // force `watch` option
    const devOptions: ProgramOptions = { ...opts, watch: true };

    // call action
    await action(devOptions);
  };

  const buildActionIgnoreWatchOption = () => buildAction(false);
  const buildActionUseWatchOption = () => buildAction(true);

  // build action
  program
    .command('build')
    .description('Build your library for production')
    .action(buildActionIgnoreWatchOption);

  // watch action
  program
    .command('watch')
    .description('Starts Bundlib in watch mode')
    .action(watchAction);

  // Default action (build)
  program
    .action(buildActionUseWatchOption);

  // parse args
  const argv = process.argv.slice(2);
  void program.parseAsync(argv, { from: 'user' });

}
