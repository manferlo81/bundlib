export { compatibilityAnalyzePkg as analyzePkg } from './analyze/compatibility'

export type {
  BrowserBuildOptions,
  Dependencies,
  InstalledModules,
  ModuleBuildOptions,
  ModuleInstalled,
  OptionalModules,
  PkgAnalyzed,
  TypesBuildOptions,
} from './analyze/pkg-analyzed'

export { bundlib } from './bundlib'
export { configsFromPkg } from './configs-from-pkg'
export { defineConfig as config, defineConfig } from './functions/define-config'

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
} from './package/pkg-json-types'

export { readPkg } from './package/read-pkg'
export { pkgToConfigs } from './pkg-to-configs'

export type {
  BooleanOption,
  BundlibConfig,
  GlobalsOption,
  OverrideKey,
  SelectiveBoolBasedOption,
  SelectiveEsModuleOption,
  SelectiveInteropOption,
  SelectiveKey,
  SelectiveMinOption,
  SelectiveObjectKey,
  SelectiveSkipOption,
  SelectiveSourcemapOption,
  SelectiveSpecialKey,
  SelectiveStringOption,
  SelectiveValueBasedOption,
  StringOption,
} from './types/bundlib-options'

export type {
  BuildType,
  SkippableBuildType as SelectiveSkipKey,
  SkippableBuildType,
} from './types/options/build-type'

// eslint-disable-next-line @typescript-eslint/no-deprecated
export type { BuildTypeForAPI, GlobalsOptions, SelectiveSkipBuildType } from './types/deprecated-exports'

export type {
  RollupSupportedBrowserFormat as BrowserBuildFormat,
  RollupSupportedFormat as BundlibBuildFormat,
  BundlibRollupBrowseOutputOptions,
  BundlibRollupModuleOutputOptions,
  BundlibRollupOptions,
  RollupSupportedModuleFormat as ModuleBuildFormat,
  RollupBundlibInterop,
  RollupSupportedESModuleOption as RollupEsModule,
  RollupSupportedESModuleString as RollupEsModuleString,
  RollupSupportedInteropOption as RollupInterop,
  RollupSupportedSourcemapOption as RollupSourcemap,
  RollupSupportedSourcemapString as RollupSourcemapString,
  RollupSupportedBrowserFormat,
  RollupSupportedESModuleOption,
  RollupSupportedESModuleString, RollupSupportedFormat, RollupSupportedInteropOption,
  RollupSupportedModuleFormat,
  RollupSupportedSourcemapOption,
  RollupSupportedSourcemapString,
} from './types/rollup'

export type { BundlibAPIOptions } from './types/types'
