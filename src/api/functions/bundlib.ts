import { analyzePkg } from '../analyze/analyze'
import type { BundlibRollupConfig } from '../options/types/rollup-options'
import { readPkg } from '../package/read-pkg'
import type { MaybeNullish } from '../types/helper-types'
import type { BundlibAPIOptions } from '../types/types'
import { pkgToConfigs } from './pkg-to-configs'

export async function bundlib(
  cwd: string,
  options?: MaybeNullish<BundlibAPIOptions>,
): Promise<BundlibRollupConfig[]> {

  // Read package.json content
  const pkgJson = await readPkg(cwd)

  // analyze package.json content
  const analyzed = await analyzePkg(cwd, pkgJson)

  // create configs
  return pkgToConfigs(analyzed, options)

}
