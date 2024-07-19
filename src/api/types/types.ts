import type { IsExternal, OutputOptions as RollupOutputOptions, Plugin, RollupOptions, WarningHandlerWithDefault, WatcherOptions as RollupWatcherOptions } from 'rollup';
import type { AllowNullish, Dictionary } from './helper-types';

export type RollupSourcemapString = 'inline' | 'hidden';
export type RollupSourcemap = boolean | RollupSourcemapString;

export type ModuleBuildFormat = 'cjs' | 'es';
export type BrowserBuildFormat = 'iife' | 'amd' | 'umd';

export type BundlibBuildFormat = ModuleBuildFormat | BrowserBuildFormat;

export interface BundlibRollupModuleOutputOptions extends RollupOutputOptions {
  file: string;
  format: BundlibBuildFormat;
  sourcemap: RollupSourcemap;
  esModule: RollupOutputOptions['esModule'];
  interop: Exclude<RollupOutputOptions['interop'], AllowNullish<CallableFunction>>;
}

export interface BundlibRollupBrowseOutputOptions extends BundlibRollupModuleOutputOptions {
  format: BrowserBuildFormat;
  extend: boolean;
  globals: Dictionary<string>;
  amd?: {
    id: string;
  };
}

export interface BundlibRollupBrowseOutputOptionsWithName extends BundlibRollupBrowseOutputOptions {
  format: 'iife' | 'umd';
  name: string;
}

export interface BundlibRollupOptions<OutputOptions extends BundlibRollupModuleOutputOptions> extends RollupOptions {
  input: string;
  output: OutputOptions;
  external: IsExternal;
  plugins: Plugin[];
  watch: RollupWatcherOptions;
}

export interface BundlibAPIOptions {
  dev?: boolean;
  watch?: boolean;
  onwarn?: WarningHandlerWithDefault;
}
