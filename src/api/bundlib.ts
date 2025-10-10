import { analyzePkg } from './analyze/analyze'
import { readPkg } from './package/read-pkg'
import { pkgToConfigs } from './pkg-to-configs'
import type { MaybeNullish } from './types/helper-types'
import type { BundlibRollupConfig } from './types/rollup'
import type { BundlibAPIOptions } from './types/types'

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
