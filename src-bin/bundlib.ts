import { analizePkg, pkgToConfigs } from "../src";

import { log, logFilename } from "./console";
import { BUILT, ERROR, WRITING, WRITTEN } from "./events";
import rollItUp from "./roll-it-up";
import { BuildEventEmitter, BundlibOptions } from "./types";

async function bundlib(cwd: string, options?: BundlibOptions): Promise<BuildEventEmitter>;
async function bundlib(cwd: string, { dev, watch, silent }: BundlibOptions = {}): Promise<BuildEventEmitter> {

  if (!silent) {
    log("> reading package.json...");
  }

  const pkg = await analizePkg(cwd);

  const configs = pkgToConfigs(pkg, dev);

  const buildProcess = await rollItUp(
    configs,
    watch,
  );

  if (!silent) {

    buildProcess.on(WRITING, (filename) => {
      logFilename(filename, cwd, "building > %s...");
    });

    buildProcess.on(WRITTEN, (filename) => {
      logFilename(filename, cwd, "built > %s");
    });

    buildProcess.on(ERROR, (err) => {
      log(err);
    });

    if (watch) {

      buildProcess.on(BUILT, () => {
        log("> watching for changes...");
      });

    }

  }

  return buildProcess;

}

export default bundlib;
