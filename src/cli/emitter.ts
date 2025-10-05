import { EventEmitter } from 'node:events';
import type { RollupError } from 'rollup';
import { cyan, green, magenta, yellow } from './tools/colors';
import { consoleLog, consoleTag, consoleWarn, logInfo, logWarning } from './tools/console';
import { formatFileSize, formatMS } from './tools/format';
import { parseFileName } from './tools/parse';
import type { BundlibEventMap } from './types/types';

export function createEmitter(cwd: string, handleError: (err: RollupError | Error) => void, watchMode?: boolean, silentMode?: boolean): EventEmitter<BundlibEventMap> {

  // Create event emitter
  const emitter = new EventEmitter<BundlibEventMap>();

  // Attach error handler (even in silent mode)
  emitter.on('error', handleError);

  // Return early if silent mode is on
  if (silentMode) return emitter;

  // Declare count and duration variables
  let buildCount = 0;
  let buildDuration = 0;
  let startedAt = 0;

  const initializeVariables = () => {
    buildCount = 0;
    buildDuration = 0;
    startedAt = Date.now();
  };

  const showFinalStatus = () => {

    // Compute additional duration
    const additionalDuration = Date.now() - startedAt - buildDuration;

    // Determine if additional duration is significant enough to be shown (> 1s)
    const significantAdditionalDuration = additionalDuration >= 1000 ? additionalDuration : 0;

    // format build count and build duration
    const coloredCount = yellow(`${buildCount} files`);
    const coloredDuration = magenta.bold(formatMS(buildDuration));

    const additionalDurationSection = significantAdditionalDuration
      ? ` + ${magenta.bold(formatMS(significantAdditionalDuration))}`
      : '';

    // Show build count and duration message
    logInfo(consoleLog, '', `Built ${coloredCount} in ${coloredDuration}${additionalDurationSection}`);

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
    const builtTag = consoleTag('BUILT', green);

    const [dirname, basename] = parseFileName(filename, cwd);

    const coloredDir = yellow(`${dirname}/`);
    const coloredFilename = yellow.bold(basename);
    const path = `${coloredDir}${coloredFilename}`;

    const coloredSize = magenta.bold(formatFileSize(size));
    const coloredDuration = magenta.bold(formatMS(duration));
    const info = `( ${coloredSize} in ${coloredDuration} )`;

    logInfo(consoleLog, `${builtTag} ${path} ${info}`);

    buildCount++;
    buildDuration += duration;
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
