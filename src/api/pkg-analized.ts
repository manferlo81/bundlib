import { Dictionary, StrictNullable } from './helper-types';
import { BundlibPkgJson } from './pkg';
import { BrowserBuildFormat, RollupSourcemap } from './types';

export interface InputOptions {
  api: StrictNullable<string>;
  bin: StrictNullable<string>;
}

export interface OptionsWithPath {
  path: string;
}

export interface ModuleBuildOptions extends OptionsWithPath {
  input: StrictNullable<string>;
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

export interface OutputOptions {
  main: StrictNullable<ModuleBuildOptions>;
  module: StrictNullable<ModuleBuildOptions>;
  browser: StrictNullable<BrowserBuildOptions>;
  bin: StrictNullable<ModuleBuildOptions>;
  types: StrictNullable<string>;
}

export interface Dependencies {
  runtime: StrictNullable<Dictionary<string>>;
  dev: StrictNullable<Dictionary<string>>;
  peer: StrictNullable<Dictionary<string>>;
}

export interface PkgAnalized {
  cwd: string;
  pkg: BundlibPkgJson;
  main: StrictNullable<ModuleBuildOptions>;
  module: StrictNullable<ModuleBuildOptions>;
  browser: StrictNullable<BrowserBuildOptions>;
  bin: StrictNullable<ModuleBuildOptions>;
  types: StrictNullable<string>;
  dependencies: Dependencies;
  cache: StrictNullable<string>;
}
