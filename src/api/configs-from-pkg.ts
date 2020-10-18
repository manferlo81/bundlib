import analyzePkg from './analyze-pkg';
import { pkgToConfigs } from './pkg-to-configs';
import type { Nullable } from './types/helper-types';
import type { BundlibPkgJson } from './types/pkg';
import type { BundlibAPIOptions, BundlibRollupModuleOutputOptions, BundlibRollupOptions } from './types/types';

async function configsFromPkg(
  cwd: string,
  options?: Nullable<BundlibAPIOptions | false>,
  pkgJson?: BundlibPkgJson,
): Promise<Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>>> {
  return pkgToConfigs(
    await analyzePkg(cwd, pkgJson),
    options || {},
  );
}

export default configsFromPkg;
