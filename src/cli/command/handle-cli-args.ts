import { greenBright } from '../tools/colors';
import { logInfo, logWarning } from '../tools/console';
import type { ActionWithOptions, ProgramOptions } from './options/option-types';
import { createProgram, registerCommand, setCommandAction } from './program';

export async function handleCLI(argv: string[], action: ActionWithOptions) {

  const program = createProgram();

  const buildAction = async (opts: ProgramOptions, useWatchOption: boolean) => {

    // warn if `watch` options is being used
    if (opts.watch) {
      logWarning(`Using the ${greenBright('--watch, -w')} option is deprecated. Please use the ${greenBright('watch')} command to run in watch mode.`);
      logInfo('');
    }

    // force `watch` option to false
    const options: ProgramOptions = useWatchOption ? opts : { ...opts, watch: false };

    // call action
    await action(options);

  };

  const watchAction: ActionWithOptions = async (opts) => {

    // warn if `watch` options is being used
    if (opts.watch) {
      logWarning(`You are using the deprecated ${greenBright('--watch, -w')} option on the ${greenBright('watch')} command. We'll ignore it this time but this will fail in the future.`);
      logInfo('');
    }

    // force `watch` option
    const options: ProgramOptions = { ...opts, watch: true };

    // call action
    await action(options);
  };

  const buildActionIgnoreWatchOption: ActionWithOptions = (opts) => buildAction(opts, false);
  const buildActionUseWatchOption: ActionWithOptions = (opts) => buildAction(opts, true);

  // build action
  registerCommand(
    program,
    'build',
    'Build your library for production',
    buildActionIgnoreWatchOption,
  );

  // watch action
  registerCommand(
    program,
    'watch',
    'Starts Bundlib in watch mode',
    watchAction,
  );

  // Default action (build)
  setCommandAction(
    program,
    buildActionUseWatchOption,
    program,
  );

  // parse args
  // const argv = process.argv.slice(2);
  return await program.parseAsync(argv, { from: 'user' });

}
