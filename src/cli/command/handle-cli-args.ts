import type { Command } from 'commander';
import type { ActionContext, ActionFunction } from '../actions/action-types';
import { logInfo, logWarning } from '../console/console';
import { greenBright } from '../tools/colors';
import { createProgram, registerCommand, setCommandAction } from './program';
import type { ProgramOptions } from './types/cli-options';
import type { ProgramAction } from './types/program';

export function handleCLI(argv: string[], action: ActionFunction, context: ActionContext): Promise<Command> {

  const { consoleWarn } = context;

  const program = createProgram();

  const buildAction = async (opts: ProgramOptions, useWatchOption: boolean) => {

    // warn if `watch` options is being used
    if (opts.watch) {
      logWarning(consoleWarn, `Using the ${greenBright('--watch, -w')} option is deprecated. Please use the ${greenBright('watch')} command to run in watch mode.`);
      logInfo(consoleWarn, '');
    }

    // force `watch` option to false
    const options: ProgramOptions = useWatchOption ? opts : { ...opts, watch: false };

    // call action
    await action(options, context);

  };

  const watchAction: ProgramAction = async (opts) => {

    // warn if `watch` options is being used
    if (opts.watch) {
      logWarning(consoleWarn, `You are using the deprecated ${greenBright('--watch, -w')} option on the ${greenBright('watch')} command. We'll ignore it this time but this will fail in the future.`);
      logInfo(consoleWarn, '');
    }

    // force `watch` option
    const options: ProgramOptions = { ...opts, watch: true };

    // call action
    await action(options, context);
  };

  const buildActionIgnoreWatchOption: ProgramAction = (opts) => buildAction(opts, false);
  const buildActionUseWatchOption: ProgramAction = (opts) => buildAction(opts, true);

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
  return program.parseAsync(argv, { from: 'user' });

}
