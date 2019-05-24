#!/usr/bin/env node

import { bundlib } from "@API";
import program from "commander";
import { version } from "../package.json";

program
  .version(version, "-v, --version")
  .option("-d, --dev", "create development builds")
  .option("-w, --watch", "run bundlib in watch mode")
  .action(async () => {
    const { dev, watch } = program;
    try {
      await bundlib(
        process.cwd(),
        { dev, watch },
      );
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.error(err && err.message);
    }
  })
  .parse(process.argv);
