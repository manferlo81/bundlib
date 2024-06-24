import chalk from 'chalk';
import { EventEmitter } from 'events';
import { createFormatter } from 'gen-unit';
import { relative } from 'path';
import prettyMs from 'pretty-ms';
import { RollupError, RollupWarning } from 'rollup';
import slash from 'slash';
import { BundlibPkgJson } from '../api';
import { readPkg } from '../api/package/read';
import { bundlib } from './bundlib';
import { log, logError } from './console';
import { EVENT_BUILD_END, EVENT_END, EVENT_ERROR, EVENT_REBUILD, EVENT_WARN } from './consts';
import { BundlibEventEmitter } from './types';

const { bold, inverse, cyan, yellow } = chalk;
const greenBold = bold.green;
const yellowBold = bold.yellow;
const magentaBold = bold.magenta;

function formatProjectInfo(name: string, ver: string) {
  const projName = greenBold(name);
  const projVer = yellowBold(`v${ver}`);
  return `${projName} ${projVer}`;
}

// ENABLE COLORS ON GIT BASH FOR WINDOWS
if (!chalk.level && 'MINGW_CHOST' in process.env) {
  chalk.level = 1;
}

export async function action(
  displayName: string,
  version: string,
  dev: boolean,
  watch: boolean,
  silent: boolean,
): Promise<void> {

  const cwd = process.cwd();
  const pkg: BundlibPkgJson = await readPkg(cwd);

  if (!silent) {

    log(`${formatProjectInfo(displayName, version)}
`);

    // TODO: Show detected modules & plugins with versions

    const { name: projectName, displayName: projectDisplayName, version: projectVersion } = pkg;
    const prjInfoName = projectDisplayName || projectName;

    if (prjInfoName && projectVersion) {
      log(`${cyan('building:')} ${formatProjectInfo(prjInfoName, projectVersion)}
`);
    }

  }

  const showError = watch ? logError : (err: RollupError) => {
    logError(err);
    process.exit(1);
  };

  const emitter: BundlibEventEmitter = new EventEmitter();
  emitter.on(EVENT_ERROR, showError);

  if (!silent) {

    const formatFileSize = createFormatter({
      unit: 'B',
      round: 2,
      find: 1024,
    });

    emitter.on(EVENT_BUILD_END, (filename: string, size: number, duration: number) => {
      const tag = inverse.green.bold(' built ');
      const path = yellowBold(`./${slash(relative(cwd, filename))}`);
      const coloredSize = magentaBold(formatFileSize(size));
      const coloredDuration = magentaBold(prettyMs(duration, { secondsDecimalDigits: 2 }));
      const info = cyan(`( ${coloredSize} in ${coloredDuration} )`);
      log(`${tag} ${path} ${info}`);
    });

    emitter.on(EVENT_WARN, (warning: RollupWarning) => {

      const { plugin, message } = warning;

      const tag = inverse.yellow(' warning! ');
      const pluginInfo = cyan(`( plugin: ${greenBold(plugin || '<UNKNOWN>')} )`);

      log(`${tag} ${pluginInfo} ${yellow(message)}`);

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
