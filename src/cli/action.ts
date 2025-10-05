import { EventEmitter } from 'node:events';
import type { RollupError, WarningHandlerWithDefault } from 'rollup';
import { displayName as bundlibName, version as bundlibVersion } from '../../package.json';
import type { PkgAnalyzed } from '../api';
import { analyzePkg, pkgToConfigs, readPkg } from '../api';
import type { ProgramOptions } from './command/options/option-types';
import { binaryPlugins, bublePlugin, optionalPlugins } from './optional-modules';
import { rollupBuild } from './rollup/build';
import { rollupWatchBuild } from './rollup/watch';
import { cyan, green, magenta, yellow } from './tools/colors';
import type { LogFunction } from './tools/console';
import { consoleError, consoleLog, consoleTag, consoleWarn, formatProjectInfo, logError, logInfo, logWarning } from './tools/console';
import { formatFileSize, formatMS } from './tools/format';
import { parseFileName } from './tools/parse';
import type { BundlibEventMap } from './types/types';

function getDetections(analyzed: PkgAnalyzed, watchMode?: boolean): string[] {

  const { installed: { babel, eslint, chokidar: chokidarInstalled, typescript }, bin } = analyzed;

  const usingChokidar = watchMode && chokidarInstalled;
  const buildingBinary = bin;

  return [
    !babel && `${green.bold('@babel/core')} not detected, using plugin ${green.bold(bublePlugin)}`,
    ...[babel, eslint, typescript]
      .map((installed) => {
        if (!installed) return;
        const { id } = installed;
        const plugin = optionalPlugins[id];
        return `${green.bold(id)} detected, using plugin ${green.bold(plugin)}`;
      }),
    buildingBinary && `${green.bold('Binary')} build detected, using plugin ${binaryPlugins.map((name) => green.bold(name)).join(' and ')}`,
    usingChokidar && `${green.bold(usingChokidar.id)} detected, using it to watch for file change`,
  ].filter<string>(Boolean as never);

}

export async function action(options: ProgramOptions): Promise<void> {

  // get NodeJS version
  const nodeVersion = process.versions.node;
  const [nodeMajorVersion] = nodeVersion.split('.');

  // log warning if NodeJS version is lower than 18
  if (+nodeMajorVersion < 18) {
    logWarning(consoleWarn, `You are running NodeJS v${nodeVersion}. This version is not officially supported. If you experience any issue, please install NodeJS 18 or greater.`);
    logInfo(consoleLog, '');
  }

  // get current working directory
  const cwd = process.cwd();

  // read package.json content
  const pkg = await readPkg(cwd);

  // analyze package.json content
  const analyzed = await analyzePkg(cwd, pkg);

  const { dev: developmentMode, watch: watchMode, silent: silentMode } = options;

  // create FATAL error handler
  const logErrorAndExit = (fn: LogFunction, err: RollupError | Error) => {
    logError(fn, err);
    process.exit(1);
  };

  const handleError = watchMode
    ? (err: RollupError | Error) => { logError(consoleError, err); }
    : (err: RollupError | Error) => logErrorAndExit(consoleError, err);

  // create event emitter
  const emitter = new EventEmitter<BundlibEventMap>();

  // declare error handler (even in silent mode)
  emitter.on('error', handleError);

  // if not in silent mode...
  if (!silentMode) {

    // show Bundlib version
    logInfo(consoleLog, formatProjectInfo(bundlibName, bundlibVersion));

    // show NodeJS version
    logInfo(consoleLog, formatProjectInfo('NodeJS', nodeVersion), '');

    const { name: projectName, displayName, version: projectVersion } = pkg;
    const projectDisplayName = displayName ?? projectName;

    // show current project info
    if (projectDisplayName && projectVersion) {
      logInfo(consoleLog, `building: ${formatProjectInfo(projectDisplayName, projectVersion)}`, '');
    }

    // get detections
    const detections = getDetections(analyzed, watchMode);

    // show detections
    detections.forEach((message) => {
      logInfo(consoleLog, message);
    });

    // log an empty line if any detection found
    if (detections.length > 0) logInfo(consoleLog, '');

    let buildCount = 0;
    let buildDuration = 0;
    let startedAt = 0;

    emitter.on('start', () => {
      buildCount = 0;
      buildDuration = 0;
      startedAt = Date.now();
    });

    emitter.on('end', () => {
      const endedAt = Date.now();
      const totalDuration = endedAt - startedAt;
      const additionalDuration = totalDuration - buildDuration;
      const significantAdditionalDuration = additionalDuration >= 1000 ? additionalDuration : 0;

      const coloredCount = yellow(`${buildCount} files`);
      const coloredDuration = magenta.bold(formatMS(buildDuration));

      const additionalDurationSection = significantAdditionalDuration
        ? ` + ${magenta.bold(formatMS(significantAdditionalDuration))}`
        : '';

      logInfo(consoleLog, '', `Built ${coloredCount} in ${coloredDuration}${additionalDurationSection}`);
    });

    // declare "build end" handler
    // to show filename, size and duration of the build process
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

    // declare "warning" handler
    emitter.on('warn', (warning) => {

      const { plugin, message } = warning;

      const pluginInfo = plugin
        ? `[ ${cyan('plugin')}: ${magenta.bold(plugin)} ] `
        : '';

      logWarning(consoleWarn, `${pluginInfo}${message}`);

    });

    // if in watch mode...
    if (watchMode) {

      // show "waiting" message after every build process is finished
      emitter.on('end', () => {
        logInfo(consoleLog, '', 'waiting for changes...');
      });

      // show "rebuilding" message when a file changed
      emitter.on('rebuild', () => {
        logInfo(consoleLog, 'rebuilding...', '');
      });

    }

  }

  try {

    // create config list from analyzed package.json
    const configs = pkgToConfigs(analyzed, { dev: developmentMode, watch: watchMode });

    // create warning handler
    const onwarn: WarningHandlerWithDefault = (warning) => {
      emitter.emit('warn', warning);
    };

    // attach warning handler to every config object
    const rollupConfigs = configs.map((config) => {
      return { ...config, onwarn };
    });

    // get build method and build files
    const buildMethod = watchMode ? rollupWatchBuild : rollupBuild;
    buildMethod(rollupConfigs, emitter);

  } catch (err) {

    // handler error if any
    handleError(err as RollupError | Error);
  }

}
