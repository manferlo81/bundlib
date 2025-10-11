import type { IsExternal, Plugin, RollupOptions, OutputOptions as RollupOutputOptions, WatcherOptions as RollupWatcherOptions } from 'rollup'
import type { Dictionary } from '../../types/helper-types'
import type { BundlibBrowserFormat, BundlibESModuleOption, BundlibInputOption, BundlibModuleFormat, BundlibNonBooleanInteropOption, BundlibOutputFormat, BundlibSourcemapOption } from './rollup'

// Output Options

interface BundlibRollupOutputOptionsWithFormat<Format extends BundlibOutputFormat> extends RollupOutputOptions {
  format: Format
  file: string
  sourcemap: BundlibSourcemapOption
  esModule: BundlibESModuleOption
  interop: BundlibNonBooleanInteropOption
  compact: boolean
}

export type BundlibRollupModuleOutputOptions = BundlibRollupOutputOptionsWithFormat<BundlibModuleFormat>

export interface BundlibRollupBrowserOutputOptions extends BundlibRollupOutputOptionsWithFormat<BundlibBrowserFormat> {
  extend: boolean
  globals: Dictionary<string>
  amd?: {
    id: string
  }
}

export type BundlibRollupAnyOutputOptions = BundlibRollupModuleOutputOptions | BundlibRollupBrowserOutputOptions

// Config

export interface BundlibRollupOptions<OutputOptions extends RollupOutputOptions> extends RollupOptions {
  input: BundlibInputOption
  output: OutputOptions
  external: IsExternal
  plugins: Plugin[]
  watch: RollupWatcherOptions
}

export type BundlibRollupModuleConfig = BundlibRollupOptions<BundlibRollupModuleOutputOptions>
export type BundlibRollupBrowserConfig = BundlibRollupOptions<BundlibRollupBrowserOutputOptions>
export type BundlibRollupConfig = BundlibRollupOptions<BundlibRollupAnyOutputOptions>
