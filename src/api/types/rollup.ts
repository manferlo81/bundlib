import type { IsExternal, Plugin, RollupOptions, OutputOptions as RollupOutputOptions, WatcherOptions as RollupWatcherOptions } from 'rollup'
import type { Dictionary, ExcludeStrict, ExtractStrict, OmitStrict } from './helper-types'

// Option output.sourcemap

type RollupOriginalSourcemapOption = NonNullable<RollupOutputOptions['sourcemap']>
export type RollupSupportedSourcemapOption = ExtractStrict<RollupOriginalSourcemapOption, 'inline' | 'hidden' | boolean>
export type RollupSupportedSourcemapString = ExcludeStrict<RollupSupportedSourcemapOption, boolean>

// Option output.esModule

type RollupOriginalESModuleOption = NonNullable<RollupOutputOptions['esModule']>
export type RollupSupportedESModuleOption = ExtractStrict<RollupOriginalESModuleOption, 'if-default-prop' | boolean>
export type RollupSupportedESModuleString = ExcludeStrict<RollupSupportedESModuleOption, boolean>

// Option output.interop

type RollupOriginalInteropOption = NonNullable<RollupOutputOptions['interop']>
export type RollupSupportedInteropOption = ExtractStrict<RollupOriginalInteropOption, 'auto' | 'compat' | 'default' | 'defaultOnly' | 'esModule'>

// FIXME: this type doesn't belong in this file, this file is for rollup supported type
export type RollupBundlibInterop = RollupSupportedInteropOption | boolean

// Option output.format

type RollupOriginalOutputFormat = NonNullable<RollupOutputOptions['format']>
export type RollupSupportedModuleFormat = ExtractStrict<RollupOriginalOutputFormat, 'cjs' | 'es'>
export type RollupSupportedBrowserFormat = ExtractStrict<RollupOriginalOutputFormat, 'iife' | 'umd' | 'amd'>
export type RollupSupportedFormat = RollupSupportedModuleFormat | RollupSupportedBrowserFormat

// Module Output Options

export interface BundlibRollupModuleOutputOptions extends RollupOutputOptions {
  file: string
  format: RollupSupportedFormat
  sourcemap: RollupSupportedSourcemapOption
  esModule: RollupSupportedESModuleOption
  interop: RollupSupportedInteropOption
  compact: boolean
}

// Browser Output Options

export interface BundlibRollupBrowseOutputOptions extends OmitStrict<BundlibRollupModuleOutputOptions, 'format'> {
  format: RollupSupportedBrowserFormat
  extend: boolean
  globals: Dictionary<string>
  amd?: {
    id: string
  }
}

// Options

export interface BundlibRollupOptions<OutputOptions extends RollupOutputOptions> extends RollupOptions {
  input: string
  output: OutputOptions
  external: IsExternal
  plugins: Plugin[]
  watch: RollupWatcherOptions
}

export type BundlibRollupConfig = BundlibRollupOptions<BundlibRollupModuleOutputOptions>
