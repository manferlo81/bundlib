import analizePkg from "./analize-pkg";
import { spinner } from "./console";
import pkgToConfigs from "./pkg-to-configs";
import rollItUp from "./roll-it-up";
import { BundlibOptions } from "./types";

const bundlib = async (cwd: string, options: BundlibOptions = {}) => {

  const { dev, watch } = options;

  const loading = spinner("reading package.json\n");
  const pkg = await analizePkg(cwd);
  loading.succeed();

  return await rollItUp(
    pkgToConfigs(pkg, !!dev),
    cwd,
    !!watch,
  );

};

export default bundlib;
