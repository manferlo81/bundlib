import type { IsExternal, Plugin, WarningHandlerWithDefault } from 'rollup'
import type { BundlibRollupAnyOutputOptions, BundlibRollupOptions } from '../options/types/rollup-options'
import type { MaybeNullish } from '../types/helper-types'

interface CreateConfigOptions<O extends BundlibRollupAnyOutputOptions> {
  input: string
  output: O
  isExternal: IsExternal
  plugins: Plugin[]
  onwarn: MaybeNullish<WarningHandlerWithDefault>
  useChokidar: boolean
}

export function createConfig<O extends BundlibRollupAnyOutputOptions>(options: CreateConfigOptions<O>): BundlibRollupOptions<O> {
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
