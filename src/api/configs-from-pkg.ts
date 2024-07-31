import { analyzePkg } from './analyze/analyze';
import { pkgToConfigs } from './pkg-to-configs';
import { type AllowNullish } from './types/helper-types';
import type { BundlibPkgJson } from './types/pkg-json';
import type { BundlibAPIOptions, BundlibRollupModuleOutputOptions, BundlibRollupOptions } from './types/types';

async function configsFromPkg(
  cwd: string,
  options?: AllowNullish<BundlibAPIOptions | false>,
  pkgJson?: BundlibPkgJson,
): Promise<Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>>> {
  return pkgToConfigs(
    await analyzePkg(cwd, pkgJson),
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    options || {},
  );
}

export default configsFromPkg;
