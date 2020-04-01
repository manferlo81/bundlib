import chalk from 'chalk';
import { EventEmitter } from 'events';
import fileSize from 'filesize';
import { relative } from 'path';
import prettyMs from 'pretty-ms';
import { RollupError, RollupWarning } from 'rollup';
import slash from 'slash';
import { BundlibPkgJson } from '../api';
import { readPkg } from '../api/read-pkg';
import { bundlib } from './bundlib';
import { log, logError } from './console';
import { BUILD_END, END, ERROR, REBUILD, WARN } from './events';
import { BundlibEventEmitter } from './types';

const { bold } = chalk;
const green = bold.green;
const yellow = bold.yellow;
const magenta = bold.magenta;

function prjInfo(name: string, ver: string) {
  const projName = green(name);
  const projVer = yellow(`v${ver}`);
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
) {

  const cwd = process.cwd();
  const pkg: BundlibPkgJson = await readPkg(cwd);

  if (!silent) {

    log(`${prjInfo(displayName, version)}
`);

    // TODO: Show detected modules & plugins with versions

    const { name: prjName, displayName: prjDispName, version: prjVer } = pkg;
    const prjInfoName = prjDispName || prjName;

    if (prjInfoName && prjVer) {
      log(`building: ${prjInfo(prjInfoName, prjVer)}
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

    emitter.on(BUILD_END, (filename: string, size: number, duration: number) => {
      const tag = green.bgBlack.inverse(' built ');
      const path = yellow(slash(relative(cwd, filename)));
      const colorSize = magenta(fileSize(size));
      const colorTime = magenta(prettyMs(duration, { secondsDecimalDigits: 2 }));
      log(`${tag} ${path} ( ${colorSize} in ${colorTime} )`);
    });

    emitter.on(WARN, (warning: RollupWarning) => {

      const { plugin, message } = warning;

      const tag = magenta('warning:');
      const msg = `${plugin ? `( plugin ${magenta(plugin)} ) ` : ''}${message}`;

      log(`${tag} ${msg}`);

    });

    if (watch) {

      emitter.on(REBUILD, () => {
        log(`rebuilding...
`);
      });

      emitter.on(END, () => {
        log(`
waiting for changes...`);

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
