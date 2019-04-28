import analizePkg from "./analize-pkg";
import { spinner, written } from "./console";
import pkgToConfigs from "./pkg-to-configs";
import rollItUp from "./roll-it-up";
import { BuildEventType, BundlibOptions } from "./types";

const bundlib = async (cwd: string, options: BundlibOptions = {}) => {

  const { dev, watch } = options;

  const loading = spinner("reading package.json\n");
  const pkg = await analizePkg(cwd);
  loading.succeed();

  const configs = pkgToConfigs(pkg, !!dev);

  const buildProcess = await rollItUp(
    configs,
    !!watch,
  );

  buildProcess.on(BuildEventType.WRITTEN, (filename) => {
    written(filename, cwd);
  });

  buildProcess.on(BuildEventType.ERROR, (err) => {
    // tslint:disable-next-line: no-console
    console.error(err);
  });

  buildProcess.on(BuildEventType.WATCHING, () => {
    // tslint:disable-next-line: no-console
    console.log("watching for changes...");
  });

  buildProcess.on(BuildEventType.REBUILDING, () => {
    // tslint:disable-next-line: no-console
    console.log("rebuilding...");
  });

  return await buildProcess;

};

export default bundlib;
