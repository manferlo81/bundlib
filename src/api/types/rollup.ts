import type { IsExternal, ModuleFormat, Plugin, RollupOptions, OutputOptions as RollupOutputOptions, WatcherOptions as RollupWatcherOptions } from 'rollup';
import type { Dictionary, ExcludeStrict, ExtractStrict, OmitStrict } from './helper-types';

export type RollupSourcemap = ExtractStrict<RollupOutputOptions['sourcemap'], 'inline' | 'hidden' | boolean>;
export type RollupSourcemapString = ExcludeStrict<RollupSourcemap, boolean>;

export type RollupEsModule = ExtractStrict<RollupOutputOptions['esModule'], 'if-default-prop' | boolean>;
export type RollupEsModuleString = ExcludeStrict<RollupEsModule, boolean>;

export type RollupInterop = ExtractStrict<RollupOutputOptions['interop'], 'auto' | 'compat' | 'default' | 'defaultOnly' | 'esModule'>;
export type RollupBundlibInterop = RollupInterop | boolean;

export type ModuleBuildFormat = ExtractStrict<ModuleFormat, 'cjs' | 'es'>;
export type BrowserBuildFormat = ExtractStrict<ModuleFormat, 'iife' | 'amd' | 'umd'>;

export type BundlibBuildFormat = ModuleBuildFormat | BrowserBuildFormat;

export interface BundlibRollupModuleOutputOptions extends RollupOutputOptions {
  file: string;
  format: BundlibBuildFormat;
  sourcemap: RollupSourcemap;
  esModule: RollupEsModule;
  interop: RollupInterop;
  compact: boolean;
}

export interface BundlibRollupBrowseOutputOptions extends OmitStrict<BundlibRollupModuleOutputOptions, 'format'> {
  format: BrowserBuildFormat;
  extend: boolean;
  globals: Dictionary<string>;
  amd?: {
    id: string;
  };
}

export interface BundlibRollupOptions<OutputOptions extends RollupOutputOptions> extends RollupOptions {
  input: string;
  output: OutputOptions;
  external: IsExternal;
  plugins: Plugin[];
  watch: RollupWatcherOptions;
}

export type BundlibRollupConfig = BundlibRollupOptions<BundlibRollupModuleOutputOptions>;
