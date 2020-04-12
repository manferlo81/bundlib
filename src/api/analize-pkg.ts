import { BundlibOptions, TypesOptions } from './bundlib-options';
import { error, invalidOptionOld, invalidPkgField } from './errors';
import { Dictionary, StrictNullable } from './helper-types';
import { keys } from './helpers';
import { loadOptions } from './options-manager';
import { normalizeBooleanOption } from './options/boolean';
import { resolveSelectiveESModuleOption } from './options/es-module';
import { resolveSelectiveInteropOption } from './options/interop';
import { normalizeBuildMin, resolveSelectiveMinOption } from './options/min';
import { resolveSelectiveProjectOption } from './options/project';
import { normalizeBuildSourcemap, resolveSelectiveSourcemapOption } from './options/sourcemap';
import { BundlibPkgJson } from './pkg';
import { BrowserBuildOptions, Dependencies, InputOptions, ModuleBuildOptions, OutputOptions, PkgAnalized } from './pkg-analized';
import { readPkg } from './read-pkg';
import { isDictionary, isDictionaryOrNull, isNull, isString, isStringOrNull } from './type-check/type-check';
import { isBrowserOption } from './validate/option-browser';
import { normalizeBuildFlag } from './validate/option-flag';
import { isBrowserFormat } from './validate/option-format';
import { isValidGlobals, normalizeBuildGlobals, normalizeGlobals } from './validate/option-globals';
import { isInOpKey } from './validate/option-input';
import { isCJSOptionKey } from './validate/option-main';
import { isModuleOptionKey } from './validate/option-module';
import { normalizeBuildName } from './validate/option-name';
import { isTypesOptionKey } from './validate/option-types';
import { invalidKeys, keysCheck } from './validate/validate-keys';

async function analizePkg(cwd: string, pkg?: BundlibPkgJson): Promise<PkgAnalized>;
async function analizePkg(cwd: string, inputPkg?: BundlibPkgJson): Promise<PkgAnalized> {

  // use provided package.json or read it from cwd

  const pkg: BundlibPkgJson = inputPkg || await readPkg(cwd);

  // ensure the content of package.json is an object
  // throw otherwise

  if (!isDictionary<BundlibPkgJson>(pkg)) {
    throw error('Invalid package.json content');
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
    bundlib: pkgBundlibOptions,
  } = pkg;

  const { config: bundlibOptions, filepath: optionsFilename } = await loadOptions(cwd, pkgBundlibOptions);

  if (!isDictionary<BundlibOptions>(bundlibOptions)) {
    throw optionsFilename
      ? error(`Invalid options found on file "${optionsFilename}".`)
      : invalidPkgField('bundlib', 'Object | string');
  }

  // ensure there are not unknown bundlib options
  // throw otherwise

  const invalidOptions = invalidKeys(bundlibOptions as never, [
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
  ] as Array<keyof BundlibOptions>);

  if (invalidOptions) {
    const optionNames = invalidOptions.map((name) => `"${name}"`).join(', ');
    throw error(`Unknown options found: (${optionNames})`);
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
  } = bundlibOptions;

  // ensure "input" option is valid
  // throw otherwise

  if (
    !isStringOrNull(inputOption) && !(
      isDictionary<InputOptions>(inputOption) && keysCheck(inputOption, isInOpKey) && keys(inputOption).every((key) => (
        isString(inputOption[key])
      ))
    )
  ) {
    throw invalidOptionOld('input', 'string | { api?: string, bin?: string }');
  }

  const topLeverSourcemap = resolveSelectiveSourcemapOption(sourcemapOption);
  const topLevelESModule = resolveSelectiveESModuleOption(esModule);
  const topLevelInterop = resolveSelectiveInteropOption(interop);
  const topLevelMin = resolveSelectiveMinOption(min);

  // ensure "format" option is valid
  // throw otherwise

  if (!isBrowserFormat(browserFormat)) {
    throw invalidOptionOld('format', '"amd" | "iife" | "amd"');
  }

  // ensure "name" option is valid
  // throw otherwise

  if (!isStringOrNull(browserName)) {
    throw invalidOptionOld('name', 'string');
  }

  // ensure "id" option is valid
  // throw otherwise

  if (!isStringOrNull(amdId)) {
    throw invalidOptionOld('id', 'string');
  }

  // ensure "globals" option is valid
  // throw otherwise

  if (!isValidGlobals(browserGlobals)) {
    throw invalidOptionOld(
      'globals',
      'Object<string, string> | string[]',
    );
  }

  // ensure "cache" option is valid
  // throw otherwise

  if (!isStringOrNull(cacheOption)) {
    throw invalidOptionOld('cache', 'string');
  }

  const perBuildProjectOption = resolveSelectiveProjectOption(projectOption);

  // ensure "main" option is valid
  // throw otherwise
  // TODO: check for invalid keys & every option format

  if (
    !isNull(mainOptions) && (mainOptions !== false) && !(
      isDictionary<ModuleBuildOptions>(mainOptions) &&
      keysCheck(mainOptions, isCJSOptionKey)
    )
  ) {
    throw invalidOptionOld(
      'main',
      'false | { sourcemap?: boolean | "inline", esModule?: boolean, interop?: boolean, min?: boolean }',
    );
  }

  // ensure "module" option is valid
  // throw otherwise
  // TODO: check for invalid keys & every option format

  if (
    !isNull(moduleOptions) && (moduleOptions !== false) && !(
      isDictionary<ModuleBuildOptions>(moduleOptions) &&
      keysCheck(moduleOptions, isModuleOptionKey)
    )
  ) {
    throw invalidOptionOld(
      'module',
      'false | { sourcemap?: boolean | "inline", min?: boolean }',
    );
  }

  // ensure "browser" option is valid
  // throw otherwise
  // TODO: check for invalid keys & every option format

  if (
    !isNull(browserOptions) && (browserOptions !== false) && !(
      isDictionary<BrowserBuildOptions>(browserOptions) &&
      keysCheck(browserOptions, isBrowserOption) &&
      isBrowserFormat(browserOptions.format) &&
      (['name', 'id'] as Array<keyof typeof browserOptions>).every((key) => (
        isStringOrNull(browserOptions[key])
      )) &&
      isValidGlobals(browserOptions.globals)
    )
  ) {
    throw invalidOptionOld(
      'browser',
      'false | { sourcemap?: boolean | "inline", esModule?: boolean, interop?: boolean, min?: boolean, ... }',
    );
  }

  // ensure "bin" option is valid
  // throw otherwise
  // TODO: check for invalid keys & every option format

  if (
    !isNull(binaryOptions) && (binaryOptions !== false) && !(
      isDictionary<ModuleBuildOptions>(binaryOptions) &&
      keysCheck(binaryOptions, isCJSOptionKey)
    )
  ) {
    throw invalidOptionOld(
      'bin',
      'false | { sourcemap?: boolean | "inline", esModule?: boolean, interop?: boolean, min?: boolean }',
    );
  }

  // ensure "types" option is valid
  // throw otherwise
  // TODO: check for invalid keys

  if (
    !isNull(typesOptions) && (typesOptions !== false) && !(
      isDictionary<TypesOptions>(typesOptions) &&
      keysCheck(typesOptions, isTypesOptionKey)
    )
  ) {
    throw invalidOptionOld('types', 'false | { equals?: boolean }');
  }

  // ensure "main" field is a supported value
  // throw otherwise

  if ((mainOptions !== false) && !isStringOrNull(pkgMain)) {
    throw invalidPkgField('main', 'string');
  }

  // ensure "module" field is a supported value if needed
  // throw otherwise

  if ((moduleOptions !== false) && !isStringOrNull(pkgModule)) {
    throw invalidPkgField('module', 'string');
  }

  // ensure "jsnext:main" field is a supported value if needed  and "module" field not present
  // throw otherwise

  if (!pkgModule && (moduleOptions !== false) && !isStringOrNull(pkgJsNextMain)) {
    throw invalidPkgField('jsnext:main', 'string');
  }

  // ensure "browser" field is a supported value if needed
  // throw otherwise

  if ((browserOptions !== false) && !isStringOrNull(pkgBrowser)) {
    throw invalidPkgField('browser', 'string');
  }

  // ensure "bin" field is a supported value if needed
  // throw otherwise

  if ((binaryOptions !== false) && !isStringOrNull(pkgBin)) {
    throw invalidPkgField('bin', 'string');
  }

  // ensure "dependencies" field is valid
  // throw otherwise

  if (!isDictionaryOrNull<Dictionary<string>>(runtimeDependencies)) {
    throw invalidPkgField('dependencies', 'Object');
  }

  // ensure "peerDependencies" field is valid
  // throw otherwise

  if (!isDictionaryOrNull<Dictionary<string>>(peerDependencies)) {
    throw invalidPkgField('peerDependencies', 'Object');
  }

  // set ES Module build output file from "module" field falling back to "jsnext:main" field

  const esModuleFile = pkgModule || pkgJsNextMain;

  // set types definition output file from "types" field falling back to "typings" field

  const typesPath = pkgTypes || typings;

  // set api and binary input from "input" option

  const { api: apiInput, bin: binInput } = isStringOrNull(inputOption)
    ? { api: inputOption } as InputOptions
    : inputOption;

  // set input files

  const input: InputOptions = {
    api: apiInput || null,
    bin: binInput || null,
  };

  // set CommonJS Module build output options

  const mainOutput: StrictNullable<ModuleBuildOptions> = (mainOptions === false || !pkgMain) ? null : {
    path: pkgMain,
    sourcemap: normalizeBuildSourcemap(
      mainOptions,
      topLeverSourcemap.main,
    ),
    esModule: normalizeBooleanOption(mainOptions, 'esModule', topLevelESModule.main),
    interop: normalizeBooleanOption(mainOptions, 'interop', topLevelInterop.main),
    min: normalizeBuildMin(mainOptions, 'main', topLevelMin),
    project: perBuildProjectOption.main,
  };

  // set ES Module build output options

  const moduleOutput: StrictNullable<ModuleBuildOptions> = (moduleOptions === false || !esModuleFile) ? null : {
    path: esModuleFile,
    sourcemap: normalizeBuildSourcemap(
      moduleOptions,
      topLeverSourcemap.module,
    ),
    esModule: topLevelESModule.module,
    interop: topLevelInterop.module,
    min: normalizeBuildMin(moduleOptions, 'module', topLevelMin),
    project: perBuildProjectOption.module,
  };

  // set Browser build output options

  const browserOutput: StrictNullable<BrowserBuildOptions> = (browserOptions === false || !pkgBrowser) ? null : {
    path: pkgBrowser,
    sourcemap: normalizeBuildSourcemap(
      browserOptions,
      topLeverSourcemap.browser,
    ),
    esModule: normalizeBooleanOption(browserOptions, 'esModule', topLevelESModule.browser),
    interop: normalizeBooleanOption(browserOptions, 'interop', topLevelInterop.browser),
    min: normalizeBuildMin(browserOptions, 'browser', topLevelMin),
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
    project: perBuildProjectOption.browser,
  };

  // set Binary build output options

  const binaryOutput: StrictNullable<ModuleBuildOptions> = (binaryOptions === false || !pkgBin) ? null : {
    path: pkgBin,
    sourcemap: normalizeBuildSourcemap(
      binaryOptions,
      topLeverSourcemap.bin,
    ),
    esModule: normalizeBooleanOption(binaryOptions, 'esModule', topLevelESModule.bin),
    interop: normalizeBooleanOption(binaryOptions, 'interop', topLevelInterop.bin),
    min: normalizeBuildMin(binaryOptions, 'bin', topLevelMin),
    project: perBuildProjectOption.bin,
  };

  // set type definitions output options

  const typesOutput: StrictNullable<string> = (typesOptions === false || !typesPath) ? null : typesPath;

  // set all output options

  const output: OutputOptions = {
    main: mainOutput,
    module: moduleOutput,
    browser: browserOutput,
    bin: binaryOutput,
    types: typesOutput,
  };

  // set dependencies options

  const dependencies: Dependencies = {
    runtime: runtimeDependencies || null,
    dev: devDependencies || null,
    peer: peerDependencies || null,
  };

  // set cache option

  const cache: StrictNullable<string> = cacheOption || null;
  // const project: StrictNullable<string> = projectOption || null;

  // return all options

  return {
    cwd,
    pkg,
    input,
    output,
    dependencies,
    cache,
  };

}

export default analizePkg;
