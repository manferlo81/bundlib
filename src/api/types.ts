import { IsExternal, OutputOptions as RollupOutputOptions, Plugin, RollupOptions, WatcherOptions as RollupWatcherOptions } from 'rollup'
import { Dictionary } from './helper-types'

export type RollupSourcemap = boolean | 'inline';

export type ModuleBuildFormat = 'cjs' | 'es';
export type BrowserBuildFormat = 'iife' | 'amd' | 'umd';

export type BundlibBuildFormat = ModuleBuildFormat | BrowserBuildFormat;

export interface BundlibRollupModuleOutputOptions extends RollupOutputOptions {
  file: string;
  format: BundlibBuildFormat;
  sourcemap: RollupSourcemap;
  esModule: boolean;
  interop: boolean;
}

export interface BundlibRollupBrowseOutputOptions extends BundlibRollupModuleOutputOptions {
  name: string;
  extend: boolean;
  globals: Dictionary<string>;
  amd?: {
    id: string;
  };
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
}
