import chalk from 'chalk';
import { EventEmitter } from 'events';
import fileSize from 'filesize';
import { relative } from 'path';
import prettyMs from 'pretty-ms';
import readPkg from 'read-pkg';
import { RollupError } from 'rollup';
import slash from 'slash';
import { BundlibAPIOptions, BundlibPkgJson } from '../api';
import bundlib from './bundlib';
import { log, logError } from './console';
import { BUILD_END, END, ERROR, START, WARN } from './events';

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

export async function action(displayName: string, version: string, silent: boolean, options: BundlibAPIOptions) {

  const cwd = process.cwd();

  const pkg: BundlibPkgJson = await readPkg({
    cwd,
    normalize: false,
  });

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

  let buildIndex = 0;

  const showError = options.watch ? logError : (err: RollupError) => {
    logError(err);
    process.exit(1);
  };

  const emitter = new EventEmitter();
  emitter.on(ERROR, showError);

  if (!silent) {

    emitter.on(BUILD_END, (filename: string, size: number, duration: number) => {
      const tag = green.bgBlack.inverse(' built ');
      const path = yellow(slash(relative(cwd, filename)));
      const colorSize = magenta(fileSize(size));
      const colorTime = magenta(prettyMs(duration, { secondsDecimalDigits: 2 }));
      log(`${tag} ${path} ( ${colorSize} in ${colorTime} )`);
    });

    emitter.on(WARN, (warning: string | { plugin: string; message: string }) => {

      let message = warning;

      if (typeof message === 'object') {
        const { plugin, message: msg } = message;
        message = msg;
        if (plugin) {
          message = `(plugin ${magenta(plugin)}) ${message}`;
        }
      }

      const tag = magenta('warning:');
      log(`${tag} ${message}`);

    });

    if (options.watch) {

      emitter.on(START, () => {
        if (buildIndex) {
          log(`rebuilding...
`);
        }
        buildIndex++;
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
      options,
      emitter,
      pkg,
    );
  } catch (err) {
    showError(err);
  }

}
