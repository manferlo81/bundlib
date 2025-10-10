import type { IsExternal, Plugin, WarningHandlerWithDefault } from 'rollup'
import type { MaybeNullish } from '../types/helper-types'
import type { BundlibRollupModuleOutputOptions, BundlibRollupOptions } from '../types/rollup'

interface CreateConfigOptions<O extends BundlibRollupModuleOutputOptions> {
  input: string
  output: O
  isExternal: IsExternal
  plugins: Plugin[]
  onwarn: MaybeNullish<WarningHandlerWithDefault>
  useChokidar: boolean
}

export function createConfig<O extends BundlibRollupModuleOutputOptions>(options: CreateConfigOptions<O>): BundlibRollupOptions<O> {
  const { input, output, isExternal: external, plugins, onwarn, useChokidar } = options
  return {
    input,
    output,
    external,
    plugins,
    watch: {
      exclude: ['node_modules/**'],
      ...useChokidar && { chokidar: {} },
    },
    ...onwarn && { onwarn },
  }
}
