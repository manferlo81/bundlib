import { EventEmitter } from 'events';
import { createFormatter } from 'gen-unit';
import { EOL } from 'os';
import { parse as pathParse, relative } from 'path';
import prettyMs from 'pretty-ms';
import type { RollupError, WarningHandlerWithDefault } from 'rollup';
import slash from 'slash';
import { displayName as bundlibName, version as bundlibVersion } from '../../package.json';
import { analyzePkg, pkgToConfigs, readPkg } from '../api';
import { rollupBuild } from './build';
import type { ProgramOptions } from './command/types/cli-options';
import { EVENT_BUILD_END, EVENT_END, EVENT_ERROR, EVENT_REBUILD, EVENT_WARN } from './consts';
import { formatProjectInfo, tag } from './format';
import { cyan, green, magenta, yellow } from './tools/colors';
import { log, logError } from './tools/console';
import type { BundlibEventMap } from './types/types';
import { rollupWatch } from './watch';

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

  if (!silentMode) {
    log(formatProjectInfo(bundlibName, bundlibVersion));
    log(`${formatProjectInfo('NodeJS', nodeVersion)}${EOL}`);

    // TODO: Show detected modules & plugins with versions

    const { name: projectName, displayName, version: projectVersion } = pkg;
    const projectDisplayName = displayName ?? projectName;

    if (projectDisplayName && projectVersion) {
      log(`${cyan('building:')} ${formatProjectInfo(projectDisplayName, projectVersion)}${EOL}`);
    }

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
      const builtTag = tag(green, 'BUILT');

      const { dir, base } = pathParse(filename);
      const coloredDir = yellow(`./${slash(relative(cwd, dir))}/`);
      const coloredFilename = yellow.bold(base);
      const path = `${coloredDir}${coloredFilename}`;

      const coloredSize = magenta.bold(formatFileSize(size));
      const coloredDuration = magenta.bold(prettyMs(duration, { secondsDecimalDigits: 2 }));
      const info = cyan(`( ${coloredSize} in ${coloredDuration} )`);

      log(`${builtTag} ${path} ${info}`);
    });

    emitter.on(EVENT_WARN, (warning) => {

      const { plugin, message } = warning;

      const warningTag = tag(yellow, 'WARNING');
      let pluginInfo = '';

      if (plugin) {
        const pluginInfo_ = yellow(`[ ${cyan('plugin')}: ${magenta.bold(plugin)} ]`);
        pluginInfo = `${pluginInfo_} `;
      }

      log(`${warningTag} ${pluginInfo}${cyan(message)}`);

    });

    if (watchMode) {

      emitter.on(EVENT_REBUILD, () => {
        log(cyan(`rebuilding...${EOL}`));
      });

      emitter.on(EVENT_END, () => {
        log(cyan(`${EOL}waiting for changes...`));
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

    const method = watchMode ? rollupWatch : rollupBuild;
    method(rollupConfigs, emitter);

  } catch (err) {
    showError(err as RollupError);
  }

}
