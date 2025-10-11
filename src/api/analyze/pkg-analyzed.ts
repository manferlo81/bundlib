import type { BundlibBrowserFormat, BundlibESModuleOption, BundlibInteropOption, BundlibSourcemapOption } from '../options/types/rollup'
import type { BundlibPkgJson, PkgJsonDependencies } from '../package/pkg-json-types'
import type { Dictionary, MaybeNull } from '../types/helper-types'
import type { IsInstalled } from '../types/private-types'

export interface ModuleBuildOptions {
  input: MaybeNull<string>
  output: string
  sourcemap: BundlibSourcemapOption
  esModule: BundlibESModuleOption
  interop: BundlibInteropOption
  min: boolean
  project: MaybeNull<string>
}

export interface BrowserBuildOptions extends ModuleBuildOptions {
  format: BundlibBrowserFormat
  name: MaybeNull<string>
  id: MaybeNull<string>
  globals: MaybeNull<Dictionary<string>>
  extend: boolean
}

export interface TypesBuildOptions {
  output: string
  equals: boolean
}

export interface Dependencies {
  runtime: MaybeNull<PkgJsonDependencies>
  dev: MaybeNull<PkgJsonDependencies>
  peer: MaybeNull<PkgJsonDependencies>
}

type OptionalModuleKeys
  = | 'babel'
    | 'eslint'
    | 'chokidar'
    | 'typescript'

interface OptionalModuleMap {
  babel: '@babel/core'
}

type GetModuleName<K extends OptionalModuleKeys> = K extends keyof OptionalModuleMap ? OptionalModuleMap[K] : K

export type OptionalModules = GetModuleName<OptionalModuleKeys>

export interface ModuleInstalled<I extends OptionalModules> {
  id: I
  version: string
}

export type InstalledModules = {
  [K in OptionalModuleKeys]: ModuleInstalled<GetModuleName<K>> | null;
}

interface InstalledModuleInfo {
  version: string
}

export interface DetectedModuleItem<K> {
  id: K
  installed: InstalledModuleInfo | null
}

export type DetectedModules = {
  [K in OptionalModuleKeys]: DetectedModuleItem<GetModuleName<K>>
}

export interface PkgAnalyzed {
  cwd: string
  pkg: BundlibPkgJson
  main: MaybeNull<ModuleBuildOptions>
  module: MaybeNull<ModuleBuildOptions>
  browser: MaybeNull<BrowserBuildOptions>
  bin: MaybeNull<ModuleBuildOptions>
  types: MaybeNull<TypesBuildOptions>
  chunks: MaybeNull<Dictionary<string>>
  dependencies: Dependencies
  cache: MaybeNull<string>
  isInstalled: IsInstalled
  installed: InstalledModules
  detected: DetectedModules
}
