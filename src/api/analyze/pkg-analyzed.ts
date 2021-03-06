import type { BundlibPkgJson } from '../package/pkg';
import type { Dictionary, StrictNullable } from '../types/helper-types';
import type { BrowserBuildFormat, RollupSourcemap } from '../types/types';

export interface ModuleBuildOptions {
  input: StrictNullable<string>;
  output: string;
  sourcemap: RollupSourcemap;
  esModule: boolean;
  interop: boolean;
  min: boolean;
  project: StrictNullable<string>;
}

export interface BrowserBuildOptions extends ModuleBuildOptions {
  format: BrowserBuildFormat;
  name: StrictNullable<string>;
  id: StrictNullable<string>;
  globals: StrictNullable<Dictionary<string>>;
  extend: boolean;
}

export interface TypesBuildOptions {
  output: string;
  equals: boolean;
}

export interface Dependencies {
  runtime: StrictNullable<Dictionary<string>>;
  dev: StrictNullable<Dictionary<string>>;
  peer: StrictNullable<Dictionary<string>>;
}

export interface PkgAnalyzed {
  cwd: string;
  pkg: BundlibPkgJson;
  main: StrictNullable<ModuleBuildOptions>;
  module: StrictNullable<ModuleBuildOptions>;
  browser: StrictNullable<BrowserBuildOptions>;
  bin: StrictNullable<ModuleBuildOptions>;
  types: StrictNullable<TypesBuildOptions>;
  chunks: StrictNullable<Dictionary<string>>;
  dependencies: Dependencies;
  cache: StrictNullable<string>;
}

export { PkgAnalyzed as PkgAnalized };
