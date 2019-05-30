#!/usr/bin/env node

import program from "commander";
import { version } from "../package.json";
import { bundlib } from "../src";

program
  .version(version, "-v, --version")
  .option("-d, --dev", "create development builds")
  .option("-w, --watch", "run bundlib in watch mode")
  .option("-s, --silent", "prevent messages from showing in the console")
  .action(async () => {
    const { dev, watch, silent } = program;
    try {
      await bundlib(
        process.cwd(),
        { dev, watch, silent },
      );
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.error(err && err.message);
    }
  })
  .parse(process.argv);
