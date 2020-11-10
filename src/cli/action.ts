import chalk from 'chalk';
import { EventEmitter } from 'events';
import { createFormatter } from 'gen-unit';
import { relative } from 'path';
import prettyMs from 'pretty-ms';
import { RollupError, RollupWarning } from 'rollup';
import slash from 'slash';
import { BundlibPkgJson } from '../api';
import { readPkg } from '../api/tools/read-pkg';
import { bundlib } from './bundlib';
import { log, logError } from './console';
import { BUILD_END, END, ERROR, REBUILD, WARN } from './events';
import { BundlibEventEmitter } from './types';

const { bold, inverse, cyan, yellow } = chalk;
const greenBold = bold.green;
const yellowBold = bold.yellow;
const magentaBold = bold.magenta;

function prjInfo(name: string, ver: string) {
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

    log(`${prjInfo(displayName, version)}
`);

    // TODO: Show detected modules & plugins with versions

    const { name: prjName, displayName: prjDispName, version: prjVer } = pkg;
    const prjInfoName = prjDispName || prjName;

    if (prjInfoName && prjVer) {
      log(`${cyan('building:')} ${prjInfo(prjInfoName, prjVer)}
`);
    }

  }

  const showError = watch ? logError : (err: RollupError) => {
    logError(err);
    process.exit(1);
  };

  const emitter: BundlibEventEmitter = new EventEmitter();
  emitter.on(ERROR, showError);

  if (!silent) {

    const formatFileSize = createFormatter({
      unit: 'B',
      round: 2,
      find: 1024,
    });

    emitter.on(BUILD_END, (filename: string, size: number, duration: number) => {
      const tag = inverse.green.bold(' built ');
      const path = yellowBold(slash(relative(cwd, filename)));
      const coloredSize = magentaBold(formatFileSize(size));
      const coloredDuration = magentaBold(prettyMs(duration, { secondsDecimalDigits: 2 }));
      const info = cyan(`( ${coloredSize} in ${coloredDuration} )`);
      log(`${tag} ${path} ${info}`);
    });

    emitter.on(WARN, (warning: RollupWarning) => {

      const { plugin, message } = warning;

      const tag = inverse.yellow(' warning! ');
      const pluginInfo = cyan(`( plugin: ${greenBold(plugin || '<UNKNOWN>')} )`);

      log(`${tag} ${pluginInfo} ${yellow(message)}`);

    });

    if (watch) {

      emitter.on(REBUILD, () => {
        log(cyan(`rebuilding...
`));
      });

      emitter.on(END, () => {
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
    showError(err);
  }

}
