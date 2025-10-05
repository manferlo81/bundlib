import type { RollupError, WarningHandlerWithDefault } from 'rollup';
import { displayName as bundlibName, version as bundlibVersion } from '../../package.json';
import type { PkgAnalyzed } from '../api';
import { analyzePkg, pkgToConfigs, readPkg } from '../api';
import type { ProgramOptions } from './command/options/option-types';
import { createEmitter } from './emitter';
import { binaryPlugins, bublePlugin, optionalPlugins } from './optional-modules';
import { rollupBuild } from './rollup/build';
import { rollupWatchBuild } from './rollup/watch';
import { green } from './tools/colors';
import { consoleError, consoleLog, consoleWarn, formatProjectInfo, logError, logInfo, logWarning } from './tools/console';

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

  // log warning if NodeJS version is lower than 18 (even in silent mode)
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

  // Declare error handler, "log only" on watch mode and "fatal error" otherwise
  const handleError = watchMode
    ? (err: RollupError | Error): void => logError(consoleError, err)
    : (err: RollupError | Error): void => {
      logError(consoleError, err);
      process.exit(1);
    };

  // create event emitter
  const emitter = createEmitter(cwd, handleError, watchMode, silentMode);

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

    if (watchMode) return void rollupWatchBuild(rollupConfigs, emitter);

    rollupBuild(rollupConfigs, emitter);

  } catch (err) {

    // handler error if any
    handleError(err as RollupError | Error);
  }

}
