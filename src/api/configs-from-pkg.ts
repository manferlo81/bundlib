import { compatibilityAnalyzePkg } from './analyze/compatibility'
import type { BundlibPkgJson } from './package/pkg-json-types'
import { pkgToConfigs } from './pkg-to-configs'
import type { MaybeNullish } from './types/helper-types'
import type { BundlibRollupConfig } from './types/rollup'
import type { BundlibAPIOptions } from './types/types'

export async function configsFromPkg(
  cwd: string,
  options?: MaybeNullish<BundlibAPIOptions | false>,
  pkgJson?: BundlibPkgJson,
): Promise<BundlibRollupConfig[]> {
  const analyzed = await compatibilityAnalyzePkg(cwd, pkgJson)
  const optionsNormalized = options === false ? null : options
  return pkgToConfigs(analyzed, optionsNormalized)
}
