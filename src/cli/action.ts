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

  const { dev: developmentMode, watch: watchMode, silent: silentMode } = options;

  const cwd = process.cwd();
  const pkg = await readPkg(cwd);

  const logErrorAndExit = (err: Error | RollupError) => {
    logError(err);
    process.exit(1);
  };

  const nodeVersion = process.versions.node;
  const [nodeMajorVersion] = nodeVersion.split('.');

  // throw Error if NodeJS version is lower than 18
  if (+nodeMajorVersion < 18) {
    logErrorAndExit(new Error(`You are running NodeJS v${nodeVersion}. This version is not supported. Please install NodeJS v18 or greater.`));
  }

  const showError = watchMode
    ? logError
    : logErrorAndExit;

  const emitter = new EventEmitter<BundlibEventMap>();
  emitter.on(EVENT_ERROR, showError);

  // analyze package.json
  const analyzed = await analyzePkg(cwd, pkg);

  //
  if (!silentMode) {

    // Show Bundlib version
    logInfo(formatProjectInfo(bundlibName, bundlibVersion));

    // Show NodeJS version
    logInfo(formatProjectInfo('NodeJS', nodeVersion), '');

    const { name: projectName, displayName, version: projectVersion } = pkg;
    const projectDisplayName = displayName ?? projectName;

    if (projectDisplayName && projectVersion) {
      logInfo(`building: ${formatProjectInfo(projectDisplayName, projectVersion)}`, '');
    }

    const detections = getDetections(analyzed, watchMode);

    detections.forEach((message) => {
      logInfo(message);
    });

    if (detections.length > 0) logInfo('');

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

    emitter.on(EVENT_WARN, (warning) => {

      const { plugin, message } = warning;

      const pluginInfo = plugin
        ? `[ ${cyan('plugin')}: ${magenta.bold(plugin)} ] `
        : '';

      logWarning(`${pluginInfo}${message}`);

    });

    if (watchMode) {

      emitter.on(EVENT_END, () => {
        logInfo('', 'waiting for changes...');
      });

      emitter.on(EVENT_REBUILD, () => {
        logInfo('rebuilding...', '');
      });

    }

  }

  try {

    const configs = pkgToConfigs(analyzed, { dev: developmentMode, watch: watchMode });

    const onwarn: WarningHandlerWithDefault = (warning) => {
      emitter.emit(EVENT_WARN, warning);
    };

    const rollupConfigs = configs.map((config) => {
      return { ...config, onwarn };
    });

    const method = watchMode ? rollupWatchBuild : rollupBuild;
    method(rollupConfigs, emitter);

  } catch (err) {
    showError(err as RollupError);
  }

}
