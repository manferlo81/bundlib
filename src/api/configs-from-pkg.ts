import { RollupOptions } from "rollup";

import analizePkg from "./analize-pkg";
import { BundlibPkgJson } from "./pkg";
import pkgToConfigs from "./pkg-to-configs";

async function configsFromPkg(cwd: string, dev?: boolean, pkgJson?: BundlibPkgJson): Promise<RollupOptions[]> {
  return pkgToConfigs(
    await analizePkg(cwd, pkgJson),
    dev,
  );
}

export default configsFromPkg;
