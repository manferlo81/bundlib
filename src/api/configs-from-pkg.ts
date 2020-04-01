import analizePkg from './analize-pkg';
import { Nullable } from './helper-types';
import { BundlibPkgJson } from './pkg';
import { pkgToConfigs } from './pkg-to-configs';
import { BundlibAPIOptions, BundlibRollupModuleOutputOptions, BundlibRollupOptions } from './types';

async function configsFromPkg(
  cwd: string,
  options?: Nullable<BundlibAPIOptions | false>,
  pkgJson?: BundlibPkgJson,
): Promise<Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>>> {
  return pkgToConfigs(
    await analizePkg(cwd, pkgJson),
    options || {},
  );
}

export default configsFromPkg;
