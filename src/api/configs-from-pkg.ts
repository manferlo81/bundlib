import analizePkg from "./analize-pkg";
import { BundlibPkgJson } from "./pkg";
import pkgToConfigs from "./pkg-to-configs";
import { BundlibRollupOptions } from "./types";

async function configsFromPkg(
  cwd: string,
  dev?: boolean,
  watch?: boolean,
  pkgJson?: BundlibPkgJson,
): Promise<BundlibRollupOptions[]> {
  return await pkgToConfigs(
    await analizePkg(cwd, pkgJson),
    dev,
    watch,
  );
}

export default configsFromPkg;
