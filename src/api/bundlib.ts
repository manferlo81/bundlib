import { analyzePkg2 } from './analyze/analyze';
import { readPkg } from './package/read-pkg';
import { pkgToConfigs } from './pkg-to-configs';
import type { Nullish } from './types/helper-types';
import type { BundlibRollupModuleOutputOptions, BundlibRollupOptions } from './types/rollup';
import type { BundlibAPIOptions } from './types/types';

export async function bundlib(
  cwd: string,
  options?: BundlibAPIOptions | Nullish,
): Promise<Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>>> {

  // Read package.json content
  const pkgJson = await readPkg(cwd);

  // analyze package.json content
  const analyzed = await analyzePkg2(cwd, pkgJson);

  // create configs
  const normalizedOptions = options ? options : {};
  return pkgToConfigs(analyzed, normalizedOptions);

}
