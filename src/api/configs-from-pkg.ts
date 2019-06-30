import analizePkg from "./analize-pkg";
import { BundlibPkgJson } from "./pkg";
import pkgToConfigs from "./pkg-to-configs";
import { BundlibRollupOptions } from "./types";

async function configsFromPkg(cwd: string, dev?: boolean, pkgJson?: BundlibPkgJson): Promise<BundlibRollupOptions[]> {
  return pkgToConfigs(
    await analizePkg(cwd, pkgJson),
    dev,
  );
}

export default configsFromPkg;
