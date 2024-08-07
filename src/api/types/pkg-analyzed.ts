import type { AllowNull, Dictionary, IsInstalled } from './helper-types';
import type { BundlibPkgJson, PkgJsonDependencies } from './pkg-json';
import type { BrowserBuildFormat, RollupBundlibInterop, RollupEsModule, RollupSourcemap } from './rollup';

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

export type OptionalModules =
  | 'babel'
  | 'eslint'
  | 'chokidar'
  | 'typescript';

export type InstalledModules = Readonly<Record<OptionalModules, string | undefined>>;

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

// Backwards support for previous typo
export { PkgAnalyzed as PkgAnalized };
