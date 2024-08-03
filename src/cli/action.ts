import { EventEmitter } from 'events';
import { createFormatter } from 'gen-unit';
import { parse as pathParse, relative } from 'path';
import prettyMs from 'pretty-ms';
import type { RollupError } from 'rollup';
import slash from 'slash';
import { readPkg } from '../api';
import { bundlib } from './bundlib';
import type { ProgramOptions } from './command/types/cli-options';
import { EVENT_BUILD_END, EVENT_END, EVENT_ERROR, EVENT_REBUILD, EVENT_WARN } from './consts';
import { formatProjectInfo, tag } from './format';
import { cyan, green, magenta, yellow } from './tools/colors';
import { log, logError } from './tools/console';
import type { BundlibEventEmitter } from './types/types';

export async function action(
  bundlibName: string,
  bundlibVersion: string,
  options: ProgramOptions,
): Promise<void> {

  const { dev, watch, silent } = options;

  const cwd = process.cwd();
  const pkg = await readPkg(cwd);

  if (!silent) {
    log(`${formatProjectInfo(bundlibName, bundlibVersion)}
`);

    // TODO: Show detected modules & plugins with versions

    const { name: projectName, displayName, version: projectVersion } = pkg;
    const projectDisplayName = displayName ?? projectName;

    if (projectDisplayName && projectVersion) {
      log(`${cyan('building:')} ${formatProjectInfo(projectDisplayName, projectVersion)}
`);
    }

  }

  const showError = watch
    ? logError
    : (err: RollupError) => {
      logError(err);
      process.exit(1);
    };

  const emitter = new EventEmitter() as BundlibEventEmitter;
  emitter.on(EVENT_ERROR, showError);

  if (!silent) {

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

    if (watch) {

      emitter.on(EVENT_REBUILD, () => {
        log(cyan(`rebuilding...
`));
      });

      emitter.on(EVENT_END, () => {
        log(cyan(`
waiting for changes...`));

      });

    }

  }

  try {
    await bundlib(
      cwd,
      dev,
      watch,
      emitter,
      pkg,
    );
  } catch (err) {
    showError(err as RollupError);
  }

}
