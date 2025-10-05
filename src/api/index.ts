/* eslint-disable @typescript-eslint/no-deprecated */

export { compatibilityAnalyzePkg as analyzePkg } from './analyze/analyze';

export type {
  BrowserBuildOptions,
  Dependencies,
  InstalledModules,
  ModuleBuildOptions,
  ModuleInstalled,
  OptionalModules,
  PkgAnalyzed,
  TypesBuildOptions,
} from './analyze/pkg-analyzed';

export { bundlib } from './bundlib';
export { configsFromPkg } from './configs-from-pkg';
export { defineConfig as config, defineConfig } from './functions/define-config';

export type {
  BundlibPkgJson,
  PkgJsonDependencies,
  PkgJsonExports,
  PkgJsonExportsObject,
  PkgJsonExportsPath,
  PkgJsonExportsPathsObject,
  PkgJsonExportsValue,
  PkgJsonModuleType,
  PkgJsonObject,
} from './package/pkg-json-types';

export { readPkg } from './package/read-pkg';
export { pkgToConfigs } from './pkg-to-configs';

export type {
  BooleanOption,
  BuildType,
  BundlibConfig,
  GlobalsOption,
  OverrideKey,
  SelectiveBoolBasedOption,
  SelectiveEsModuleOption,
  SelectiveInteropOption,
  SelectiveKey,
  SelectiveMinOption,
  SelectiveObjectKey,
  SelectiveSkipKey,
  SelectiveSkipOption,
  SelectiveSourcemapOption,
  SelectiveSpecialKey,
  SelectiveStringOption,
  SelectiveValueBasedOption,
  StringOption,
} from './types/bundlib-options';

export type { BuildTypeForAPI, GlobalsOptions, SelectiveSkipBuildType } from './types/deprecated-exports';

export type {
  BrowserBuildFormat,
  BundlibBuildFormat,
  BundlibRollupBrowseOutputOptions,
  BundlibRollupModuleOutputOptions,
  BundlibRollupOptions,
  ModuleBuildFormat,
  RollupBundlibInterop,
  RollupEsModule,
  RollupEsModuleString,
  RollupInterop,
  RollupSourcemap,
  RollupSourcemapString,
} from './types/rollup';

export type { BundlibAPIOptions } from './types/types';
