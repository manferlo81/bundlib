import { Ora } from "ora";
import analizePkg from "./analize-pkg";
import { buildSpinner, spinner } from "./console";
import { ERROR, REBUILDING, WATCHING, WRITING, WRITTEN } from "./events";
import pkgToConfigs from "./pkg-to-configs";
import rollItUp from "./roll-it-up";
import { BundlibOptions } from "./types";

const bundlib = async (cwd: string, { dev, watch }: BundlibOptions = {}) => {

  const loading = spinner("reading package.json\n");
  const pkg = await analizePkg(cwd);
  loading.succeed();

  const configs = pkgToConfigs(pkg, !!dev);

  const files: Record<string, null | Ora> = {};

  const buildProcess = await rollItUp(
    configs,
    !!watch,
  );

  buildProcess.on(WRITING, (filename) => {
    files[filename] = buildSpinner(filename, cwd);
  });

  buildProcess.on(WRITTEN, (filename) => {
    const oraHandler = files[filename] || buildSpinner(filename, cwd);
    oraHandler.succeed();
    files[filename] = null;
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

  return await buildProcess;

};

export default bundlib;
