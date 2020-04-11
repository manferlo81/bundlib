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
  sourcemap: RollupSourcemap;
  esModule: boolean;
  interop: boolean;
  min: boolean;
}

export interface BrowserBuildOptions extends ModuleBuildOptions {
  format: BrowserBuildFormat;
  name: StrictNullable<string>;
  id: StrictNullable<string>;
  globals: StrictNullable<Dictionary<string>>;
  extend: boolean;
}

export type TypesBuildOptions = OptionsWithPath;

export interface OutputOptions {
  main: StrictNullable<ModuleBuildOptions>;
  module: StrictNullable<ModuleBuildOptions>;
  browser: StrictNullable<BrowserBuildOptions>;
  bin: StrictNullable<ModuleBuildOptions>;
  types: StrictNullable<TypesBuildOptions>;
}

export interface Dependencies {
  runtime: StrictNullable<Dictionary<string>>;
  dev: StrictNullable<Dictionary<string>>;
  peer: StrictNullable<Dictionary<string>>;
}

export interface PkgAnalized {
  cwd: string;
  pkg: BundlibPkgJson;
  input: InputOptions;
  output: OutputOptions;
  dependencies: Dependencies;
  cache: StrictNullable<string>;
  project: StrictNullable<string>;
}
