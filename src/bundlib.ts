import analizePkg from "./analize-pkg";
import { spinner, written } from "./console";
import { WRITTEN } from "./events";
import pkgToConfigs from "./pkg-to-configs";
import rollItUp from "./roll-it-up";
import { BundlibOptions } from "./types";

const bundlib = async (cwd: string, options: BundlibOptions = {}) => {

  const { dev, watch } = options;

  const loading = spinner("reading package.json\n");
  const pkg = await analizePkg(cwd);
  loading.succeed();

  const buildProcess = await rollItUp(
    pkgToConfigs(pkg, !!dev),
    cwd,
    !!watch,
  );

  buildProcess.on(WRITTEN, (filename) => {
    written(filename, cwd);
  });

  return await buildProcess;

};

export default bundlib;
