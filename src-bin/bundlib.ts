import { analizePkg, pkgToConfigs } from "../src";

import chalk from "chalk";
import fileSize from "filesize";
import { relative } from "path";
import prettyMs from "pretty-ms";

import build from "./build";
import { log } from "./console";
import { BundlibOptions } from "./types";
import watchBuild from "./watch";

import { version } from "../package.json";

async function bundlib(cwd: string, { dev, watch, silent }: BundlibOptions): Promise<void> {

  if (!silent) {
    log(`${chalk.green.bold(`Bundlib v${version}`)}
`);
    log(`${chalk.cyan.bold("reading package.json...")}
`);
  }

  const pkg = await analizePkg(cwd);
  const configs = pkgToConfigs(pkg, dev);

  let buildIndex = 0;

  (watch ? watchBuild : build)(configs, silent ? {} : {

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
      log(err);
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

  });

}

export default bundlib;
