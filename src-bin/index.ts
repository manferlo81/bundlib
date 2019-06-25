#!/usr/bin/env node

import chalk from "chalk";
import program from "commander";
import fileSize from "filesize";
import { relative } from "path";
import prettyMs from "pretty-ms";

import { version } from "../package.json";
import bundlib from "./bundlib";
import { log } from "./console";

function logError(err: Error) {
  // tslint:disable-next-line: no-console
  console.error(`${chalk.bgRed.bold(" error ")} ${err && (err.message || err)}`);
}

async function action() {

  const cwd = process.cwd();
  const { dev, watch, silent } = program;

  if (!silent) {
    log(`${chalk.green.bold(`Bundlib v${version}`)}
`);
    log(`${chalk.cyan.bold("reading package.json...")}
`);
  }

  let buildIndex = 0;

  try {

    await bundlib(cwd, { dev, watch }, {

      error(err) {
        logError(err);
      },

      ...!silent && {

        buildEnd({ filename, duration, size }) {
          log(
            `${
            chalk.green.inverse.bold(" built ")
            } ${
            chalk.yellow.bold(relative(cwd, filename))
            } ( ${
            chalk.magenta.bold(fileSize(size))
            } ${chalk.cyan("in")} ${
            chalk.magenta.bold(prettyMs(duration, { secondsDecimalDigits: 2 }))
            } )`,
          );
        },

        error(err) {
          throw err;
        },

        ...watch && {

          start() {
            if (buildIndex) {
              log(`${chalk.cyan("rebuilding...")}
`);
            }
            buildIndex++;
          },

          end() {
            log(`
${chalk.cyan("watching for changes...")}`);
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
