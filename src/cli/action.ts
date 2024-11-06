import { createFormatter } from 'gen-unit';
import { EventEmitter } from 'node:events';
import { parse as parsePath, relative } from 'node:path';
import prettyMs from 'pretty-ms';
import type { RollupError, WarningHandlerWithDefault } from 'rollup';
import slash from 'slash';
import { displayName as bundlibName, version as bundlibVersion } from '../../package.json';
import type { PkgAnalyzed } from '../api';
import { analyzePkg, pkgToConfigs, readPkg } from '../api';
import type { ProgramOptions } from './command/options/option-types';
import { EVENT_BUILD_END, EVENT_END, EVENT_ERROR, EVENT_REBUILD, EVENT_WARN } from './events';
import { binaryPlugins, bublePlugin, optionalPlugins } from './optional-modules';
import { rollupBuild } from './rollup/build';
import { rollupWatchBuild } from './rollup/watch';
import { cyan, green, magenta, yellow } from './tools/colors';
import { consoleTag, formatProjectInfo, logError, logInfo, logWarning } from './tools/console';
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
    logWarning(`You are running NodeJS v${nodeVersion}. This version is not officially supported. If you experience any issue, please install NodeJS 18 or greater.`);
    logInfo('');
  }

  // get current working directory
  const cwd = process.cwd();

  // read package.json content
  const pkg = await readPkg(cwd);

  // analyze package.json content
  const analyzed = await analyzePkg(cwd, pkg);

  const { dev: developmentMode, watch: watchMode, silent: silentMode } = options;

  // create FATAL error handler
  const logErrorAndExit = (err: RollupError | Error) => {
    logError(err);
    process.exit(1);
  };

  const handleError = watchMode
    ? logError
    : logErrorAndExit;

  // create event emitter
  const emitter = new EventEmitter<BundlibEventMap>();

  // declare error handler (even in silent mode)
  emitter.on(EVENT_ERROR, handleError);

  // if not in silent mode...
  if (!silentMode) {

    // show Bundlib version
    logInfo(formatProjectInfo(bundlibName, bundlibVersion));

    // show NodeJS version
    logInfo(formatProjectInfo('NodeJS', nodeVersion), '');

    const { name: projectName, displayName, version: projectVersion } = pkg;
    const projectDisplayName = displayName ?? projectName;

    // show current project info
    if (projectDisplayName && projectVersion) {
      logInfo(`building: ${formatProjectInfo(projectDisplayName, projectVersion)}`, '');
    }

    // get detections
    const detections = getDetections(analyzed, watchMode);

    // show detections
    detections.forEach((message) => {
      logInfo(message);
    });

    // log an empty line if any detection found
    if (detections.length > 0) logInfo('');

    // create file size formatter
    const formatFileSize = createFormatter({
      unit: 'B',
      round: 2,
      find: {
        base: 1024,
        find: [
          { pre: '', exp: 0 },
          { pre: 'K', exp: 1 },
          { pre: 'M', exp: 2 },
        ],
      },
    });

    // declare "build end" handler
    // to show filename, size and duration of the build process
    emitter.on(EVENT_BUILD_END, (filename, size, duration) => {
      const builtTag = consoleTag('BUILT', green);

      const { dir, base } = parsePath(filename);
      const coloredDir = yellow(`./${slash(relative(cwd, dir))}/`);
      const coloredFilename = yellow.bold(base);
      const path = `${coloredDir}${coloredFilename}`;

      const coloredSize = magenta.bold(formatFileSize(size));
      const coloredDuration = magenta.bold(prettyMs(duration, { secondsDecimalDigits: 2 }));
      const info = `( ${coloredSize} in ${coloredDuration} )`;

      logInfo(`${builtTag} ${path} ${info}`);
    });

    // declare "warning" handler
    emitter.on(EVENT_WARN, (warning) => {

      const { plugin, message } = warning;

      const pluginInfo = plugin
        ? `[ ${cyan('plugin')}: ${magenta.bold(plugin)} ] `
        : '';

      logWarning(`${pluginInfo}${message}`);

    });

    // if in watch mode...
    if (watchMode) {

      // show "waiting" message after every build process is finished
      emitter.on(EVENT_END, () => {
        logInfo('', 'waiting for changes...');
      });

      // show "rebuilding" message when a file changed
      emitter.on(EVENT_REBUILD, () => {
        logInfo('rebuilding...', '');
      });

    }

  }

  try {

    // create config list from analyzed package.json
    const configs = pkgToConfigs(analyzed, { dev: developmentMode, watch: watchMode });

    // create warning handler
    const onwarn: WarningHandlerWithDefault = (warning) => {
      emitter.emit(EVENT_WARN, warning);
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
