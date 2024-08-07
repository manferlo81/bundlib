import { analyzePkg } from './analyze/analyze';
import { pkgToConfigs } from './pkg-to-configs';
import type { AllowNullish } from './types/helper-types';
import type { BundlibPkgJson } from './types/pkg-json';
import type { BundlibRollupModuleOutputOptions, BundlibRollupOptions } from './types/rollup';
import type { BundlibAPIOptions } from './types/types';

export async function configsFromPkg(
  cwd: string,
  options?: AllowNullish<BundlibAPIOptions | false>,
  pkgJson?: BundlibPkgJson,
): Promise<Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>>> {
  const analyzed = await analyzePkg(cwd, pkgJson);
  return pkgToConfigs(analyzed, options === false ? null : options);
}
