#!/usr/bin/env node

import chalk from "chalk";
import program from "commander";
import fileSize from "filesize";
import { relative } from "path";
import prettyMs from "pretty-ms";

import { version } from "../../package.json";
import bundlib from "./bundlib";
import { log } from "./console";

function logError(err: Error) {
  if (err.stack) {
    // tslint:disable-next-line: no-console
    console.error(err.stack);
  }
  // tslint:disable-next-line: no-console
  console.error(`${chalk.bgRed.bold(" error ")} ${err.message || err}`);
}

async function action() {

  const cwd = process.cwd();
  const { dev, watch, silent } = program;

  if (!silent) {
    const msgHead = chalk.green.bold(`Bundlib v${version}`);
    const msgReading = chalk.cyan.bold("reading package.json...");
    log(`${msgHead}
`);
    log(`${msgReading}
`);
  }

  let buildIndex = 0;

  try {

    await bundlib(cwd, { dev, watch }, {

      error(err) {
        logError(err);
      },

      ...!silent && {

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

        ...watch && {

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

        },

      },

    });

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
