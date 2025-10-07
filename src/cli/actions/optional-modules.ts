import type { OptionalModules } from '../../api'
import type { ExcludeStrict } from '../../api/types/helper-types'

export type OptionalModulePlugin = ExcludeStrict<OptionalModules, 'chokidar'>

export const optionalPlugins: Record<OptionalModulePlugin, string> = {
  '@babel/core': '@rollup/plugin-babel',
  eslint: '@rollup/plugin-eslint',
  typescript: 'rollup-plugin-typescript2',
}

export const alternativePlugins: Partial<Record<OptionalModulePlugin, string>> = {
  '@babel/core': '@rollup/plugin-buble',
}

export const binaryPlugins = [
  'rollup-plugin-strip-shebang',
  'rollup-plugin-add-shebang',
]
