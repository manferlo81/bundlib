import analizePkg from "./analize-pkg";
import { BundlibPkgJson } from "./pkg";
import pkgToConfigs from "./pkg-to-configs";
import { BundlibAPIOptions, BundlibRollupModuleOutputOptions, BundlibRollupOptions, Nullable } from "./types";

async function configsFromPkg(
  cwd: string,
  options?: Nullable<BundlibAPIOptions | false>,
  pkgJson?: BundlibPkgJson,
): Promise<Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>>> {
  return await pkgToConfigs(
    await analizePkg(cwd, pkgJson),
    options || {},
  );
}

export default configsFromPkg;
