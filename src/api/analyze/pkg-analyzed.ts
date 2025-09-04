import type { BundlibPkgJson, PkgJsonDependencies } from '../package/pkg-json-types';
import type { AllowNull, Dictionary, IsInstalled } from '../types/helper-types';
import type { BrowserBuildFormat, RollupBundlibInterop, RollupEsModule, RollupSourcemap } from '../types/rollup';

export interface ModuleBuildOptions {
  input: AllowNull<string>;
  output: string;
  sourcemap: RollupSourcemap;
  esModule: RollupEsModule;
  interop: RollupBundlibInterop;
  min: boolean;
  project: AllowNull<string>;
}

export interface BrowserBuildOptions extends ModuleBuildOptions {
  format: BrowserBuildFormat;
  name: AllowNull<string>;
  id: AllowNull<string>;
  globals: AllowNull<Dictionary<string>>;
  extend: boolean;
}

export interface TypesBuildOptions {
  output: string;
  equals: boolean;
}

export interface Dependencies {
  runtime: AllowNull<PkgJsonDependencies>;
  dev: AllowNull<PkgJsonDependencies>;
  peer: AllowNull<PkgJsonDependencies>;
}

type OptionalModulesKeys
  = | 'babel'
    | 'eslint'
    | 'chokidar'
    | 'typescript';

interface OptionalModulesMap {
  babel: '@babel/core';
}
type GetModuleName<K extends string> = K extends keyof OptionalModulesMap ? OptionalModulesMap[K] : K;

export type OptionalModules = GetModuleName<OptionalModulesKeys>;
export interface ModuleInstalled<I extends OptionalModules> {
  id: I;
  version: string;
}

export type InstalledModules = {
  [K in OptionalModulesKeys]: ModuleInstalled<GetModuleName<K>> | null;
};

export interface PkgAnalyzed {
  cwd: string;
  pkg: BundlibPkgJson;
  main: AllowNull<ModuleBuildOptions>;
  module: AllowNull<ModuleBuildOptions>;
  browser: AllowNull<BrowserBuildOptions>;
  bin: AllowNull<ModuleBuildOptions>;
  types: AllowNull<TypesBuildOptions>;
  chunks: AllowNull<Dictionary<string>>;
  dependencies: Dependencies;
  cache: AllowNull<string>;
  isInstalled: IsInstalled;
  installed: InstalledModules;
}
