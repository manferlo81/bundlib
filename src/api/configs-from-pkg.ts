import { compatibilityAnalyzePkg } from './analyze/analyze';
import type { BundlibPkgJson } from './package/pkg-json-types';
import { pkgToConfigs } from './pkg-to-configs';
import type { AllowNullish } from './types/helper-types';
import type { BundlibRollupModuleOutputOptions, BundlibRollupOptions } from './types/rollup';
import type { BundlibAPIOptions } from './types/types';

export async function configsFromPkg(
  cwd: string,
  options?: AllowNullish<BundlibAPIOptions | false>,
  pkgJson?: BundlibPkgJson,
): Promise<Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>>> {
  const analyzed = await compatibilityAnalyzePkg(cwd, pkgJson);
  return pkgToConfigs(analyzed, options === false ? null : options);
}
