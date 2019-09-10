#!/usr/bin/env node

import program from "commander";
import { displayName, version } from "../../package.json";

import { action } from "./action";

declare module "commander" {
  interface CommanderStatic {
    dev: boolean;
    watch: boolean;
    silent: boolean;
  }
}

program
  .version(version, "-v, --version")
  .option("-d, --dev", "create development builds")
  .option("-w, --watch", "run bundlib in watch mode")
  .option("-s, --silent", "prevent messages from showing in the console")
  .action(() => {
    const { dev, watch, silent } = program;
    action(displayName, version, silent, {
      dev,
      watch,
    });
  })
  .parse(process.argv);
