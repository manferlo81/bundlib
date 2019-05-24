import { relative } from "path";
import analizePkg from "./analize-pkg";
import { BUILT, ERROR, WRITING, WRITTEN } from "./events";
import pkgToConfigs from "./pkg-to-configs";
import rollItUp from "./roll-it-up";
import { BundlibOptions } from "./types";

import { version } from "../package.json";

const bundlib = async (cwd: string, { dev, watch, silent }: BundlibOptions = {}) => {

  if (!silent) {
    // tslint:disable-next-line: no-console
    console.log("bundlib v" + version);
    // tslint:disable-next-line: no-console
    console.log("reading package.json...");
  }

  const pkg = await analizePkg(cwd);

  const configs = pkgToConfigs(pkg, !!dev);

  const buildProcess = await rollItUp(
    configs,
    !!watch,
  );

  if (!silent) {

    buildProcess.on(WRITING, (filename) => {
      // tslint:disable-next-line: no-console
      console.log(`building > ${relative(cwd, filename)}...`);
    });

    buildProcess.on(WRITTEN, (filename) => {
      // tslint:disable-next-line: no-console
      console.log(`built > ${relative(cwd, filename)}`);
    });

    buildProcess.on(ERROR, (err) => {
      // tslint:disable-next-line: no-console
      console.error(err);
    });

    if (watch) {

      buildProcess.on(BUILT, () => {
        // tslint:disable-next-line: no-console
        console.log("watching for changes...");
      });

    }

  }

  return buildProcess;

};

export default bundlib;
