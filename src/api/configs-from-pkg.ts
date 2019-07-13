import analizePkg from "./analize-pkg";
import { BundlibPkgJson } from "./pkg";
import pkgToConfigs from "./pkg-to-configs";
import { BundlibAPIOptions, BundlibRollupOptions, BundlibRollupOutputOptions, Nullable } from "./types";

async function configsFromPkg(
  cwd: string,
  options?: Nullable<BundlibAPIOptions | false>,
  pkgJson?: BundlibPkgJson,
): Promise<Array<BundlibRollupOptions<BundlibRollupOutputOptions>>> {
  return await pkgToConfigs(
    await analizePkg(cwd, pkgJson),
    options,
  );
}

export default configsFromPkg;
