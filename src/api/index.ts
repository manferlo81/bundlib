export { compatibilityAnalyzePkg as analyzePkg } from './analyze/compatibility'
export { bundlib } from './functions/bundlib'
export { configsFromPkg } from './functions/configs-from-pkg'
export { defineConfig as config, defineConfig } from './functions/define-config'
export { pkgToConfigs } from './functions/pkg-to-configs'
export { readPkg } from './package/read-pkg'

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
} from './options/types/bundlib'

export type {
  BuildType,
  SkippableBuildType as SelectiveSkipKey,
  SkippableBuildType,
} from './options/types/build-type'

export type {
  BundlibOutputFormat as BrowserBuildFormat,
  BundlibOutputFormat as BundlibBuildFormat,
  BundlibInteropOption as RollupBundlibInterop,
  BundlibESModuleOption as RollupEsModule,
  BundlibNonBooleanESModuleOption as RollupEsModuleString,
  BundlibNonBooleanInteropOption as RollupInterop,
  BundlibSourcemapOption as RollupSourcemap,
  BundlibNonBooleanSourcemapOption as RollupSourcemapString,
  BundlibBrowserFormat as RollupSupportedBrowserFormat,
  BundlibESModuleOption as RollupSupportedESModuleOption,
  BundlibNonBooleanESModuleOption as RollupSupportedESModuleString,
  BundlibOutputFormat as RollupSupportedFormat,
  BundlibInteropOption as RollupSupportedInteropOption,
  BundlibModuleFormat as RollupSupportedModuleFormat,
  BundlibSourcemapOption as RollupSupportedSourcemapOption,
  BundlibNonBooleanSourcemapOption as RollupSupportedSourcemapString,
} from './options/types/rollup'

export type {
  BundlibRollupBrowserOutputOptions,
  BundlibRollupModuleOutputOptions,
  BundlibRollupOptions,
} from './options/types/rollup-options'

export type { BundlibAPIOptions } from './types/types'

// eslint-disable-next-line @typescript-eslint/no-deprecated
export type { BuildTypeForAPI, GlobalsOptions, SelectiveSkipBuildType } from './types/deprecated-exports'
