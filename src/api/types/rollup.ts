import type { IsExternal, ModuleFormat, Plugin, RollupOptions, OutputOptions as RollupOutputOptions, WatcherOptions as RollupWatcherOptions } from 'rollup';
import type { Dictionary, SelectFrom } from './helper-types';

export type RollupSourcemap = Extract<RollupOutputOptions['sourcemap'], string | boolean>;
export type RollupSourcemapString = Exclude<RollupSourcemap, boolean>;

export type RollupEsModule = Extract<RollupOutputOptions['esModule'], string | boolean>;
export type RollupEsModuleString = Exclude<RollupEsModule, boolean>;

export type RollupInterop = Extract<RollupOutputOptions['interop'], string>;
export type RollupBundlibInterop = RollupInterop | boolean;

export type ModuleBuildFormat = SelectFrom<ModuleFormat, 'cjs' | 'es'>;
export type BrowserBuildFormat = SelectFrom<ModuleFormat, 'iife' | 'amd' | 'umd'>;

export type BundlibBuildFormat = ModuleBuildFormat | BrowserBuildFormat;

export interface BundlibRollupModuleOutputOptions extends RollupOutputOptions {
  file: string;
  format: BundlibBuildFormat;
  sourcemap: RollupSourcemap;
  esModule: RollupEsModule;
  interop: RollupInterop;
}

export interface BundlibRollupBrowseOutputOptions extends Omit<BundlibRollupModuleOutputOptions, 'format'> {
  format: BrowserBuildFormat;
  extend: boolean;
  globals: Dictionary<string>;
  amd?: {
    id: string;
  };
}

export interface BundlibRollupBrowseOutputOptionsWithName extends Omit<BundlibRollupBrowseOutputOptions, 'format'> {
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
