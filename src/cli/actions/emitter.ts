import { EventEmitter } from 'node:events';
import type { RollupError } from 'rollup';
import type { ProgramOptions } from '../command/types/cli-options';
import { logInfo, logWarning } from '../console/console';
import { formatTag } from '../console/format';
import { cyan, green, magenta, yellow } from '../tools/colors';
import { formatFileSize, formatMS } from '../tools/format';
import { parseFileName } from '../tools/parse';
import type { ActionContext } from './action-types';
import type { BundlibEventEmitter } from './emitter-types';
import type { BundlibEventMap } from './event-map';

export function createEmitter(cwd: string, programOptions: ProgramOptions, context: ActionContext, handleError: (err: RollupError | Error) => void): BundlibEventEmitter {

  const { watch: watchMode, silent: silentMode } = programOptions;
  const { consoleLog, consoleInfo, consoleWarn } = context;

  // Create event emitter
  const emitter = new EventEmitter<BundlibEventMap>();

  // Attach error handler (even in silent mode)
  emitter.on('error', handleError);

  // Return early if silent mode is on
  if (silentMode) return emitter;

  // Declare count and duration variables
  let buildCount = 0;
  let startedAt = 0;

  const initializeVariables = () => {
    logInfo(consoleInfo, 'Build started...', '');

    buildCount = 0;
    startedAt = Date.now();
  };

  const showFinalStatus = () => {

    // Compute build duration
    const buildDuration = Date.now() - startedAt;

    // format build count and build duration
    const coloredCount = yellow(`${buildCount} files`);
    const coloredDuration = magenta.bold(formatMS(buildDuration));

    // Show build count and duration message
    logInfo(consoleLog, '', `Built ${coloredCount} in ${coloredDuration}`);

  };

  // Attach handler to initialize final count and duration
  emitter.on('start', initializeVariables);

  // Create end handler
  const handleEnd = watchMode
    ? () => {
      showFinalStatus();
      logInfo(consoleLog, '', 'waiting for changes...');
    }
    : showFinalStatus;

  // Attach handler to show final count and duration
  emitter.on('end', handleEnd);

  // Attach handler to show filename, size and duration of every file built
  emitter.on('build-end', (filename, size, duration) => {
    const builtTag = formatTag('BUILT', green);

    const [dirname, basename] = parseFileName(filename, cwd);

    const coloredDir = yellow(`${dirname}/`);
    const coloredFilename = yellow.bold(basename);
    const path = `${coloredDir}${coloredFilename}`;

    const coloredSize = magenta.bold(formatFileSize(size));
    const coloredDuration = magenta.bold(formatMS(duration));
    const info = `( ${coloredSize} in ${coloredDuration} )`;

    logInfo(consoleLog, `${builtTag} ${path} ${info}`);

    buildCount++;
  });

  // Attach warning handler
  emitter.on('warn', (warning) => {

    const { plugin, message } = warning;

    const pluginInfo = plugin
      ? `[ ${cyan('plugin')}: ${magenta.bold(plugin)} ] `
      : '';

    logWarning(consoleWarn, `${pluginInfo}${message}`);

  });

  // Return early if watch mode is off
  if (!watchMode) return emitter;

  // Attach handler to show "rebuilding" message on watch mode
  return emitter.on('rebuild', () => {
    logInfo(consoleLog, 'rebuilding...', '');
  });

}
