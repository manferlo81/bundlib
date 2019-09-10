import chalk from "chalk";
import fileSize from "filesize";
import { relative } from "path";
import prettyMs from "pretty-ms";
import readPkg from "read-pkg";
import slash from "slash";

import { BundlibPkgJson } from "../api";

import bundlib from "./bundlib";
import { log, logError } from "./console";
import { BuildCallbackObject, BundlibOptions } from "./types";

function prjInfo(name: string, ver: string) {

  const projName = chalk.bold.green(name);
  const projVer = chalk.bold.yellow(`v${ver}`);

  return `${projName} ${projVer}`;

}

export async function action(displayName: string, version: string, silent: boolean, options: BundlibOptions) {

  if (!chalk.level && !chalk.enabled && process.platform === "win32" && process.env.MINGW_CHOST) {
    chalk.level = 3;
    chalk.enabled = true;
  }

  const cwd = process.cwd();

  let pkg: BundlibPkgJson | undefined;

  if (!silent) {

    const appInfo = prjInfo(displayName, version);
    log(`${appInfo}
`);

    const filename = chalk.bold.yellow("package.json");
    log(`reading: ${filename}`);

    pkg = await readPkg({
      cwd,
      normalize: false,
    });

    const { name: prjName, displayName: prjDispName, version: prjVer } = pkg;
    const prjInfoName = prjDispName as (string | undefined) || prjName;

    if (prjInfoName && prjVer) {

      const info = prjInfo(prjInfoName, prjVer);
      log(`building: ${info}
`);

    }

  }

  let buildIndex = 0;

  const callbacks: BuildCallbackObject = {

    error(err) {
      logError(err);
    },

  };

  if (!silent) {

    Object.assign(callbacks, {

      buildEnd(filename, size, duration) {
        const tag = chalk.bold.bgBlack.green.inverse(" built ");
        const path = chalk.bold.yellow(slash(relative(cwd, filename)));
        const colorSize = chalk.bold.magenta(fileSize(size));
        const colorTime = chalk.bold.magenta(prettyMs(duration, { secondsDecimalDigits: 2 }));
        log(`${tag} ${path} ( ${colorSize} in ${colorTime} )`);
      },

      error(err) {
        logError(err);
      },

      warn(warning) {

        let message = warning;

        if (typeof message === "object") {

          const { plugin, message: msg } = message;

          message = msg;

          if (plugin) {
            message = `(plugin ${chalk.bold.magenta(plugin)}) ${message}`;
          }

        }

        const tag = chalk.bold.magenta("warning:");

        log(`${tag} ${message}`);

      },

    } as BuildCallbackObject);

    if (options.watch) {

      Object.assign(callbacks, {

        start() {
          if (buildIndex) {
            log(`rebuilding...
`);
          }
          buildIndex++;
        },

        end() {
          log(`
waiting for changes...`);
        },

      } as BuildCallbackObject);

    }

  }

  try {
    await bundlib(cwd, options, callbacks, pkg);
  } catch (err) {
    logError(err);
  }

}
