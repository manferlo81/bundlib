#!/usr/bin/env node

import chalk from "chalk";
import program from "commander";
import fileSize from "filesize";
import { relative } from "path";
import prettyMs from "pretty-ms";
import readPkg from "read-pkg";

import { version } from "../../package.json";
import { BundlibPkgJson } from "../api/pkg";

import slash from "slash";
import bundlib from "./bundlib";
import { log, logError } from "./console";
import { BuildCallbackObject } from "./types.js";

async function action() {

  if (!chalk.level && !chalk.enabled && process.platform === "win32" && process.env.MINGW_CHOST) {
    chalk.level = 3;
    chalk.enabled = true;
  }

  const cwd = process.cwd();
  const { dev, watch, silent } = program;

  let pkg: BundlibPkgJson | undefined;

  if (!silent) {
    const app = chalk.green(`Bundlib`);
    const msgVersion = chalk.yellow(`v${version}`);
    log(chalk.bold(`${app} ${msgVersion}
`));
    const msgReading = chalk.bold("reading package.json...");
    log(`${msgReading}
`);

    pkg = await readPkg({
      cwd,
      normalize: false,
    });

    const { name, version: ver } = pkg;

    if (name && ver) {

      const projName = chalk.green(name);
      const projVer = chalk.yellow(`v${ver}`);

      log(chalk.bold(`building: ${projName} ${projVer}
`));

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

    } as BuildCallbackObject);

    if (watch) {

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
    await bundlib(cwd, { dev, watch }, callbacks, pkg);
  } catch (err) {
    logError(err);
  }

}

program
  .version(version, "-v, --version")
  .option("-d, --dev", "create development builds")
  .option("-w, --watch", "run bundlib in watch mode")
  .option("-s, --silent", "prevent messages from showing in the console")
  .action(action)
  .parse(process.argv);
