import analizePkg from "./analize-pkg";
import { log, logFilename } from "./console";
import { BUILT, ERROR, WRITING, WRITTEN } from "./events";
import pkgToConfigs from "./pkg-to-configs";
import rollItUp from "./roll-it-up";
import { BundlibOptions } from "./types";

const bundlib = async (cwd: string, { dev, watch, silent }: BundlibOptions = {}) => {

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

};

export default bundlib;
