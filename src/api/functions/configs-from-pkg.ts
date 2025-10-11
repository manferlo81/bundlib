import { compatibilityAnalyzePkg } from '../analyze/compatibility'
import type { BundlibRollupConfig } from '../options/types/rollup-options'
import type { BundlibPkgJson } from '../package/pkg-json-types'
import type { MaybeNullish } from '../types/helper-types'
import type { BundlibAPIOptions } from '../types/types'
import { pkgToConfigs } from './pkg-to-configs'

export async function configsFromPkg(
  cwd: string,
  options?: MaybeNullish<BundlibAPIOptions | false>,
  pkgJson?: BundlibPkgJson,
): Promise<BundlibRollupConfig[]> {
  const analyzed = await compatibilityAnalyzePkg(cwd, pkgJson)
  const optionsNormalized = options === false ? null : options
  return pkgToConfigs(analyzed, optionsNormalized)
}
