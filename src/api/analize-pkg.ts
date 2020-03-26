import readPkg from 'read-pkg'
import { BundlibOptions } from './bundlib-options'
import { error, invalidOption, invalidPkgField } from './errors'
import { StrictNullable } from './helper-types'
import { keys } from './helpers'
import { BundlibPkgJson } from './pkg'
import { BrowserBuildOptions, CommonJSBuildOptions, Dependencies, ESModuleBuildOptions, InputOptions, OutputOptions, PkgAnalized, TypesBuildOptions } from './pkg-analized'
import { isBool, isDictionary, isDictionaryOrNull, isNull, isString, isStringOrNull } from './type-check'
import { isBrowserOption } from './validate/option-browser'
import { isModuleOption, normalizeBuildModule, normalizeModuleOption } from './validate/option-esmodule'
import { normalizeBuildFlag } from './validate/option-flag'
import { isBrowserFormat } from './validate/option-format'
import { isValidGlobals, normalizeBuildGlobals, normalizeGlobals } from './validate/option-globals'
import { isInOpKey } from './validate/option-input'
import { isCJSOptionKey } from './validate/option-main'
import { isValidMinOption, normalizeBuildMin, normalizeMinOption } from './validate/option-min'
import { isModuleOptionKey } from './validate/option-module'
import normalizeBuildName from './validate/option-name'
import { normalizeBuildSourcemap, normalizeSourcemap } from './validate/option-sourcemap'
import { isTypesOptionKey } from './validate/option-types'
import { invalidKeys, keysInList } from './validate/validate-keys'

async function analizePkg(cwd: string, pkg?: BundlibPkgJson): Promise<PkgAnalized>;
async function analizePkg(cwd: string, inputPkg?: BundlibPkgJson): Promise<PkgAnalized> {

  // use provided package.json or read it from cwd

  const pkg: BundlibPkgJson = inputPkg || await readPkg({ cwd, normalize: false })

  // ensure the content of package.json is an object
  // throw otherwise

  if (!isDictionary(pkg)) {
    throw error('Invalid package.json content')
  }

  const {
    name: pkgName,
    main: pkgMain,
    module: pkgModule,
    'jsnext:main': pkgJsNextMain,
    browser: pkgBrowser,
    bin: pkgBin,
    types: pkgTypes,
    typings,
    dependencies: runtimeDependencies,
    devDependencies,
    peerDependencies,
    bundlib: bundlibOptions = {},
  } = pkg

  // ensure "bundlib" field is null, undefined (or not present) or an object
  // throw otherwise

  if (!isDictionaryOrNull(bundlibOptions)) {
    throw invalidPkgField('bundlib', 'Object')
  }

  // ensure there are not unknown bundlib options
  // throw otherwise

  const invalidOptions = invalidKeys(bundlibOptions, [
    'input',
    'extend',
    'esModule',
    'interop',
    'equals',
    'sourcemap',
    'format',
    'name',
    'id',
    'globals',
    'min',
    'cache',
    'project',
    'main',
    'module',
    'browser',
    'bin',
    'types',
  ] as Array<keyof BundlibOptions>)

  if (invalidOptions) {
    const optionNames = invalidOptions.map((name) => `"${name}"`).join(', ')
    throw error(`Unknown options found: (${optionNames})`)
  }

  const {
    input: inputOption,
    sourcemap: sourcemapOption,
    esModule,
    interop,
    extend,
    format: browserFormat,
    name: browserName,
    id: amdId,
    globals: browserGlobals,
    min,
    cache: cacheOption,
    project: projectOption,
    main: mainOptions,
    module: moduleOptions,
    browser: browserOptions,
    bin: binaryOptions,
    types: typesOptions,
  } = bundlibOptions

  // ensure "input" option is valid
  // throw otherwise

  if (
    !isStringOrNull(inputOption) && !(
      isDictionary<string>(inputOption) && keysInList(inputOption, isInOpKey) && keys(inputOption).every((key) => (
        isString(inputOption[key])
      ))
    )
  ) {
    throw invalidOption('input', 'string | { api?: string, bin?: string }')
  }

  // ensure "sourcemap" option is valid
  // throw otherwise

  if (!isNull(sourcemapOption) && !isBool(sourcemapOption) && sourcemapOption !== 'inline') {
    throw invalidOption('sourcemap', 'boolean | "inline"')
  }

  // ensure "esModule" option is valid
  // throw otherwise

  if (!isModuleOption(esModule)) {
    throw invalidOption(
      'esModule',
      'boolean | "main" | "browser" | "bin" | Array<"main" | "browser" | "bin">',
    )
  }

  // ensure "interop" option is valid
  // throw otherwise

  if (!isModuleOption(interop)) {
    throw invalidOption(
      'interop',
      'boolean | "main" | "browser" | "bin" | Array<"main" | "browser" | "bin">',
    )
  }

  // ensure "format" option is valid
  // throw otherwise

  if (!isBrowserFormat(browserFormat)) {
    throw invalidOption('format', '"amd" | "iife" | "amd"')
  }

  // ensure "name" option is valid
  // throw otherwise

  if (!isStringOrNull(browserName)) {
    throw invalidOption('name', 'string')
  }

  // ensure "id" option is valid
  // throw otherwise

  if (!isStringOrNull(amdId)) {
    throw invalidOption('id', 'string')
  }

  // ensure "globals" option is valid
  // throw otherwise

  if (!isValidGlobals(browserGlobals)) {
    throw invalidOption(
      'globals',
      'Object<string, string> | string[]',
    )
  }

  // ensure "min" option is valid
  // throw otherwise

  if (!isValidMinOption(min)) {
    throw invalidOption(
      'min',
      'boolean | "main" | "module" | "browser" | "bin" | Array<"main" | "module" | "browser" | "bin">',
    )
  }

  // ensure "cache" option is valid
  // throw otherwise

  if (!isStringOrNull(cacheOption)) {
    throw invalidOption('cache', 'string')
  }

  // ensure "project" option is valid
  // throw otherwise

  if (!isStringOrNull(projectOption)) {
    throw invalidOption('project', 'string')
  }

  // ensure "main" option is valid
  // throw otherwise
  // TODO: check for invalid keys & every option format

  if (
    !isNull(mainOptions) && (mainOptions !== false) && !(
      isDictionary<string>(mainOptions) &&
      keysInList(mainOptions, isCJSOptionKey)
    )
  ) {
    throw invalidOption(
      'main',
      'false | { sourcemap?: boolean | "inline", esModule?: boolean, interop?: boolean, min?: boolean }',
    )
  }

  // ensure "module" option is valid
  // throw otherwise
  // TODO: check for invalid keys & every option format

  if (
    !isNull(moduleOptions) && (moduleOptions !== false) && !(
      isDictionary<never>(moduleOptions) &&
      keysInList(moduleOptions, isModuleOptionKey)
    )
  ) {
    throw invalidOption(
      'module',
      'false | { sourcemap?: boolean | "inline", min?: boolean }',
    )
  }

  // ensure "browser" option is valid
  // throw otherwise
  // TODO: check for invalid keys & every option format

  if (
    !isNull(browserOptions) && (browserOptions !== false) && !(
      isDictionary<never>(browserOptions) &&
      keysInList(browserOptions, isBrowserOption) &&
      isBrowserFormat(browserOptions.format) &&
      (['name', 'id'] as Array<keyof typeof browserOptions>).every((key) => (
        isStringOrNull(browserOptions[key])
      )) &&
      isValidGlobals(browserOptions.globals)
    )
  ) {
    throw invalidOption(
      'browser',
      'false | { sourcemap?: boolean | "inline", esModule?: boolean, interop?: boolean, min?: boolean, ... }',
    )
  }

  // ensure "bin" option is valid
  // throw otherwise
  // TODO: check for invalid keys & every option format

  if (
    !isNull(binaryOptions) && (binaryOptions !== false) && !(
      isDictionary<never>(binaryOptions) &&
      keysInList(binaryOptions, isCJSOptionKey)
    )
  ) {
    throw invalidOption(
      'bin',
      'false | { sourcemap?: boolean | "inline", esModule?: boolean, interop?: boolean, min?: boolean }',
    )
  }

  // ensure "types" option is valid
  // throw otherwise
  // TODO: check for invalid keys

  if (
    !isNull(typesOptions) && (typesOptions !== false) && !(
      isDictionary<never>(typesOptions) &&
      keysInList(typesOptions, isTypesOptionKey)
    )
  ) {
    throw invalidOption('types', 'false | { equals?: boolean }')
  }

  // ensure "main" field is a supported value
  // throw otherwise

  if ((mainOptions !== false) && !isStringOrNull(pkgMain)) {
    throw invalidPkgField('main', 'string')
  }

  // ensure "module" field is a supported value if needed
  // throw otherwise

  if ((moduleOptions !== false) && !isStringOrNull(pkgModule)) {
    throw invalidPkgField('module', 'string')
  }

  // ensure "jsnext:main" field is a supported value if needed  and "module" field not present
  // throw otherwise

  if (!pkgModule && (moduleOptions !== false) && !isStringOrNull(pkgJsNextMain)) {
    throw invalidPkgField('jsnext:main', 'string')
  }

  // ensure "browser" field is a supported value if needed
  // throw otherwise

  if ((browserOptions !== false) && !isStringOrNull(pkgBrowser)) {
    throw invalidPkgField('browser', 'string')
  }

  // ensure "bin" field is a supported value if needed
  // throw otherwise

  if ((binaryOptions !== false) && !isStringOrNull(pkgBin)) {
    throw invalidPkgField('bin', 'string')
  }

  // ensure "dependencies" field is valid
  // throw otherwise

  if (!isDictionaryOrNull(runtimeDependencies)) {
    throw invalidPkgField('dependencies', 'Object')
  }

  // ensure "peerDependencies" field is valid
  // throw otherwise

  if (!isDictionaryOrNull(peerDependencies)) {
    throw invalidPkgField('peerDependencies', 'Object')
  }

  // set ES Module build output file from "module" field falling back to "jsnext:main" field

  const esModuleFile = pkgModule || pkgJsNextMain

  // set types definition output file from "types" field falling back to "typings" field

  const typesPath = pkgTypes || typings

  // set api and binary input from "input" option

  const { api: apiInput, bin: binInput } = isStringOrNull(inputOption)
    ? { api: inputOption } as InputOptions
    : inputOption

  // set input files

  const input: InputOptions = {
    api: apiInput || null,
    bin: binInput || null,
  }

  // normalize global options

  const globalSourcemap = normalizeSourcemap(sourcemapOption)
  const globalESModule = normalizeModuleOption(esModule)
  const globalInterop = normalizeModuleOption(interop)
  const globalMin = normalizeMinOption(min)

  // set CommonJS Module build output options

  const mainOutput: StrictNullable<CommonJSBuildOptions> = (mainOptions === false || !pkgMain) ? null : {
    path: pkgMain,
    sourcemap: normalizeBuildSourcemap(
      mainOptions,
      globalSourcemap,
    ),
    esModule: normalizeBuildModule(mainOptions, 'esModule', 'main', globalESModule),
    interop: normalizeBuildModule(mainOptions, 'interop', 'main', globalInterop),
    min: normalizeBuildMin(mainOptions, 'main', globalMin),
  }

  // set ES Module build output options

  const moduleOutput: StrictNullable<ESModuleBuildOptions> = (moduleOptions === false || !esModuleFile) ? null : {
    path: esModuleFile,
    sourcemap: normalizeBuildSourcemap(
      moduleOptions,
      globalSourcemap,
    ),
    min: normalizeBuildMin(moduleOptions, 'module', globalMin),
  }

  // set Browser build output options

  const browserOutput: StrictNullable<BrowserBuildOptions> = (browserOptions === false || !pkgBrowser) ? null : {
    path: pkgBrowser as string,
    sourcemap: normalizeBuildSourcemap(
      browserOptions,
      globalSourcemap,
    ),
    esModule: normalizeBuildModule(browserOptions, 'esModule', 'browser', globalESModule),
    interop: normalizeBuildModule(browserOptions, 'interop', 'browser', globalInterop),
    min: normalizeBuildMin(browserOptions, 'browser', globalMin),
    format: browserOptions && !isNull(browserOptions.format) ? browserOptions.format : (browserFormat || 'umd'),
    name: normalizeBuildName(
      cwd,
      browserOptions ? browserOptions.name : null,
      browserName,
      pkgName,
    ),
    id: browserOptions && browserOptions.id || amdId || null,
    globals: normalizeBuildGlobals(
      browserOptions,
      normalizeGlobals(browserGlobals),
    ),
    extend: normalizeBuildFlag(browserOptions, 'extend', !!extend),
  }

  // set Binary build output options

  const binaryOutput: StrictNullable<CommonJSBuildOptions> = (binaryOptions === false || !pkgBin) ? null : {
    path: pkgBin as string,
    sourcemap: normalizeBuildSourcemap(
      binaryOptions,
      globalSourcemap,
    ),
    esModule: normalizeBuildModule(binaryOptions, 'esModule', 'bin', globalESModule),
    interop: normalizeBuildModule(binaryOptions, 'interop', 'bin', globalInterop),
    min: normalizeBuildMin(binaryOptions, 'bin', globalMin),
  }

  // set type definitions output options

  const typesOutput: StrictNullable<TypesBuildOptions> = (typesOptions === false || !typesPath) ? null : {
    path: typesPath,
  }

  // set all output options

  const output: OutputOptions = {
    main: mainOutput,
    module: moduleOutput,
    browser: browserOutput,
    bin: binaryOutput,
    types: typesOutput,
  }

  // set dependencies options

  const dependencies: Dependencies = {
    runtime: runtimeDependencies || null,
    dev: devDependencies || null,
    peer: peerDependencies || null,
  }

  // set cache option

  const cache: StrictNullable<string> = cacheOption || null
  const project: StrictNullable<string> = projectOption || null

  // return all options

  return {
    cwd,
    pkg,
    input,
    output,
    dependencies,
    cache,
    project,
  }

}

export default analizePkg
