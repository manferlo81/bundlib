#!/usr/bin/env node

import chalk from "chalk";
import program from "commander";
import fileSize from "filesize";
import { relative } from "path";
import prettyMs from "pretty-ms";

import { version } from "../../package.json";
import bundlib from "./bundlib";
import { log, logError } from "./console";
import { BuildCallbackObject } from "./types.js";

async function action() {

  const cwd = process.cwd();
  const { dev, watch, silent } = program;

  if (!silent) {
    const msgVersion = chalk.green.bold(`Bundlib v${version}`);
    const msgReading = chalk.cyan.bold("reading package.json...");
    log(`${msgVersion}
`);
    log(`${msgReading}
`);
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
        const colorTag = chalk.green.inverse.bold(" built ");
        const colorFilename = chalk.yellow.bold(relative(cwd, filename));
        const colorSize = chalk.magenta.bold(fileSize(size));
        const colorIn = chalk.cyan("in");
        const colorTime = chalk.magenta.bold(prettyMs(duration, { secondsDecimalDigits: 2 }));
        log(`${colorTag} ${colorFilename} ( ${colorSize} ${colorIn} ${colorTime} )`);
      },

      error(err) {
        logError(err);
      },

    } as BuildCallbackObject);

    if (watch) {

      Object.assign(callbacks, {

        start() {
          if (buildIndex) {
            const msgRebuild = chalk.cyan("rebuilding...");
            log(`${msgRebuild}
`);
          }
          buildIndex++;
        },

        end() {
          const msgWait = chalk.cyan("waiting for changes...");
          log(`
${msgWait}`);
        },

      } as BuildCallbackObject);

    }

  }

  try {
    await bundlib(cwd, { dev, watch }, callbacks);
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
