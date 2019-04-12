import analizePkg from "./analize-pkg";
import { log, showInfo } from "./console";
import pkgToConfigs from "./pkg-to-configs";
import rollItUp from "./roll-it-up";
import { BundlibOptions } from "./types";

const bundlib = async (cwd: string, options: BundlibOptions = {}) => {

  const { dev, watch } = options;

  showInfo("reading package.json");
  log();

  const pkg = await analizePkg(cwd);

  return await rollItUp(
    pkgToConfigs(pkg, !!dev),
    cwd,
    !!watch,
  );

};

export default bundlib;
