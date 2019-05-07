import { Ora } from "ora";
import analizePkg from "./analize-pkg";
import { buildSpinner, spinner } from "./console";
import { ERROR, REBUILDING, WATCHING, WRITING, WRITTEN } from "./events";
import pkgToConfigs from "./pkg-to-configs";
import rollItUp from "./roll-it-up";
import { BundlibOptions } from "./types";

const bundlib = async (cwd: string, { dev, watch, silent }: BundlibOptions = {}) => {

  const loading = !silent && spinner("reading package.json\n");
  const pkg = await analizePkg(cwd);
  if (loading) {
    loading.succeed();
  }

  const configs = pkgToConfigs(pkg, !!dev);

  const files: Record<string, null | Ora> = {};

  const buildProcess = await rollItUp(
    configs,
    !!watch,
  );

  if (!silent) {

    buildProcess.on(WRITING, (filename) => {
      files[filename] = buildSpinner(filename, cwd);
    });

    buildProcess.on(WRITTEN, (filename) => {
      let instance = files[filename];
      if (instance) {
        instance.succeed();
        files[filename] = instance = null;
      }
    });

    buildProcess.on(ERROR, (err) => {
      // tslint:disable-next-line: no-console
      console.error(err);
    });

    buildProcess.on(WATCHING, () => {
      // tslint:disable-next-line: no-console
      console.log("watching for changes...");
    });

    buildProcess.on(REBUILDING, () => {
      // tslint:disable-next-line: no-console
      console.log("rebuilding...");
    });

  }

  return await buildProcess;

};

export default bundlib;
