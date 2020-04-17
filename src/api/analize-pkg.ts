import { BundlibOptions, TypesOptions } from './bundlib-options';
import { error, invalidOption, invalidOptionOld, invalidPkgField } from './errors';
import { Dictionary, StrictNullable } from './helper-types';
import { loadOptions } from './load-options';
import { normalizeBooleanOption } from './options/boolean';
import { isBrowserOption } from './options/browser';
import { resolveSelectiveESModuleOption } from './options/es-module';
import { isBrowserFormat } from './options/format';
import { isValidGlobals, normalizeBuildGlobals, normalizeGlobals } from './options/globals';
import { resolveSelectiveInputOption } from './options/input';
import { resolveSelectiveInteropOption } from './options/interop';
import { isCJSOptionKey } from './options/main-and-bin';
import { normalizeBuildMin, resolveSelectiveMinOption } from './options/min';
import { isModuleOptionKey } from './options/module';
import { normalizeBuildName } from './options/name';
import { resolveSelectiveProjectOption } from './options/project';
import { resolveSelectiveSkipOption } from './options/skip';
import { normalizeBuildSourcemap, resolveSelectiveSourcemapOption } from './options/sourcemap';
import { isTypesOptionKey } from './options/types';
import { BundlibPkgJson } from './pkg';
import { BrowserBuildOptions, Dependencies, ModuleBuildOptions, PkgAnalized } from './pkg-analized';
import { readPkg } from './tools/read-pkg';
import { invalidKeys, keysCheck } from './type-check/keys';
import { isDictionary, isDictionaryOrNull, isNull, isStringOrNull } from './type-check/type-check';

async function analizePkg(cwd: string, pkg?: BundlibPkgJson): Promise<PkgAnalized>;
async function analizePkg(cwd: string, inputPkg?: BundlibPkgJson): Promise<PkgAnalized> {

  const pkg: BundlibPkgJson = inputPkg || await readPkg(cwd);

  if (!isDictionary<BundlibPkgJson>(pkg)) {
    throw error('Invalid package.json content');
  }

  const {
    name: packageName,
    main: mainOutputFile,
    module: moduleFieldValue,
    'jsnext:main': jsNextFieldValue,
    browser: browserOutputFile,
    bin: binaryOutputFile,
    types: typesFieldValue,
    typings,
    dependencies: runtimeDependencies,
    devDependencies,
    peerDependencies,
  } = pkg;

  const loadedOptions = await loadOptions(cwd, pkg.bundlib);
  const loadedBundlibOptions = loadedOptions && loadedOptions.config;

  if (loadedOptions && !isNull(loadedBundlibOptions) && !isDictionary<BundlibOptions>(loadedBundlibOptions)) {
    throw loadedOptions.filepath
      ? error(`Invalid options found on file "${loadedOptions.filepath}".`)
      : invalidPkgField('bundlib', 'Object | string');
  }

  const bundlibOptions = loadedBundlibOptions || {};

  const invalidOptions = invalidKeys(
    bundlibOptions as never,
    [
      'input',
      'extend',
      'esModule',
      'interop',
      'sourcemap',
      'format',
      'name',
      'id',
      'globals',
      'min',
      'cache',
      'project',
      'skip',
      'equals',
      'main',
      'module',
      'browser',
      'bin',
      'types',
    ],
  );

  if (invalidOptions) {
    const optionNames = invalidOptions.map((name) => `"${name}"`).join(', ');
    throw error(`Unknown options found: (${optionNames})`);
  }

  const {
    extend,
    format: browserFormat,
    name: browserName,
    id: amdId,
    globals: browserGlobals,
    cache: cacheOption,
    main: deprecatedMainOptions,
    module: deprecatedModuleOptions,
    browser: deprecatedBrowserOptions,
    bin: deprecatedBinaryOptions,
    types: deprecatedTypesOptions,
  } = bundlibOptions;

  const perBuildInput = resolveSelectiveInputOption(bundlibOptions.input);
  const perBuildSourcemap = resolveSelectiveSourcemapOption(bundlibOptions.sourcemap);
  const perBuildESModule = resolveSelectiveESModuleOption(bundlibOptions.esModule);
  const perBuildInterop = resolveSelectiveInteropOption(bundlibOptions.interop);
  const perBuildMin = resolveSelectiveMinOption(bundlibOptions.min);

  if (!isBrowserFormat(browserFormat)) {
    throw invalidOption(
      'format',
      'https://github.com/manferlo81/bundlib#format',
    );
  }

  if (!isStringOrNull(browserName)) {
    throw invalidOption(
      'name',
      'https://github.com/manferlo81/bundlib#name',
    );
  }

  if (!isStringOrNull(amdId)) {
    throw invalidOption(
      'id',
      'https://github.com/manferlo81/bundlib#id',
    );
  }

  if (!isValidGlobals(browserGlobals)) {
    throw invalidOption(
      'globals',
      'https://github.com/manferlo81/bundlib#globals',
    );
  }

  if (!isStringOrNull(cacheOption)) {
    throw invalidOption(
      'cache',
      'https://github.com/manferlo81/bundlib#cache',
    );
  }

  const perBuildProject = resolveSelectiveProjectOption(bundlibOptions.project);
  const skipBuild = resolveSelectiveSkipOption(bundlibOptions.skip);

  if (
    !isNull(deprecatedMainOptions) && (deprecatedMainOptions !== false) && !(
      isDictionary<ModuleBuildOptions>(deprecatedMainOptions) &&
      keysCheck(deprecatedMainOptions, isCJSOptionKey)
    )
  ) {
    throw invalidOptionOld(
      'main',
      'false | { sourcemap?: boolean | "inline", esModule?: boolean, interop?: boolean, min?: boolean }',
    );
  }

  if (
    !isNull(deprecatedModuleOptions) && (deprecatedModuleOptions !== false) && !(
      isDictionary<ModuleBuildOptions>(deprecatedModuleOptions) &&
      keysCheck(deprecatedModuleOptions, isModuleOptionKey)
    )
  ) {
    throw invalidOptionOld(
      'module',
      'false | { sourcemap?: boolean | "inline", min?: boolean }',
    );
  }

  if (
    !isNull(deprecatedBrowserOptions) && (deprecatedBrowserOptions !== false) && !(
      isDictionary<BrowserBuildOptions>(deprecatedBrowserOptions) &&
      keysCheck(deprecatedBrowserOptions, isBrowserOption) &&
      isBrowserFormat(deprecatedBrowserOptions.format) &&
      (['name', 'id'] as Array<keyof typeof deprecatedBrowserOptions>).every((key) => (
        isStringOrNull(deprecatedBrowserOptions[key])
      )) &&
      isValidGlobals(deprecatedBrowserOptions.globals)
    )
  ) {
    throw invalidOptionOld(
      'browser',
      'false | { sourcemap?: boolean | "inline", esModule?: boolean, interop?: boolean, min?: boolean, ... }',
    );
  }

  if (
    !isNull(deprecatedBinaryOptions) && (deprecatedBinaryOptions !== false) && !(
      isDictionary<ModuleBuildOptions>(deprecatedBinaryOptions) &&
      keysCheck(deprecatedBinaryOptions, isCJSOptionKey)
    )
  ) {
    throw invalidOptionOld(
      'bin',
      'false | { sourcemap?: boolean | "inline", esModule?: boolean, interop?: boolean, min?: boolean }',
    );
  }

  if (
    !isNull(deprecatedTypesOptions) && (deprecatedTypesOptions !== false) && !(
      isDictionary<TypesOptions>(deprecatedTypesOptions) &&
      keysCheck(deprecatedTypesOptions, isTypesOptionKey)
    )
  ) {
    throw invalidOptionOld('types', 'false | { equals?: boolean }');
  }

  if ((deprecatedMainOptions !== false) && !isStringOrNull(mainOutputFile)) {
    throw invalidPkgField('main', 'string');
  }

  if ((deprecatedModuleOptions !== false) && !isStringOrNull(moduleFieldValue)) {
    throw invalidPkgField('module', 'string');
  }

  if (!moduleFieldValue && (deprecatedModuleOptions !== false) && !isStringOrNull(jsNextFieldValue)) {
    throw invalidPkgField('jsnext:main', 'string');
  }

  if ((deprecatedBrowserOptions !== false) && !isStringOrNull(browserOutputFile)) {
    throw invalidPkgField('browser', 'string');
  }

  if ((deprecatedBinaryOptions !== false) && !isStringOrNull(binaryOutputFile)) {
    throw invalidPkgField('bin', 'string');
  }

  if (!isDictionaryOrNull<Dictionary<string>>(runtimeDependencies)) {
    throw invalidPkgField('dependencies', 'Object');
  }

  if (!isDictionaryOrNull<Dictionary<string>>(peerDependencies)) {
    throw invalidPkgField('peerDependencies', 'Object');
  }

  const moduleOutputFile = moduleFieldValue || jsNextFieldValue;

  const typesOutputFile = typesFieldValue || typings;

  const mainOutput: StrictNullable<ModuleBuildOptions> = (deprecatedMainOptions === false || skipBuild.main || !mainOutputFile) ? null : {
    input: perBuildInput.main,
    output: mainOutputFile,
    sourcemap: normalizeBuildSourcemap(
      deprecatedMainOptions,
      perBuildSourcemap.main,
    ),
    esModule: normalizeBooleanOption(deprecatedMainOptions, 'esModule', perBuildESModule.main),
    interop: normalizeBooleanOption(deprecatedMainOptions, 'interop', perBuildInterop.main),
    min: normalizeBuildMin(deprecatedMainOptions, 'main', perBuildMin),
    project: perBuildProject.main,
  };

  const moduleOutput: StrictNullable<ModuleBuildOptions> = (deprecatedModuleOptions === false || skipBuild.module || !moduleOutputFile) ? null : {
    input: perBuildInput.module,
    output: moduleOutputFile,
    sourcemap: normalizeBuildSourcemap(
      deprecatedModuleOptions,
      perBuildSourcemap.module,
    ),
    esModule: perBuildESModule.module,
    interop: perBuildInterop.module,
    min: normalizeBuildMin(deprecatedModuleOptions, 'module', perBuildMin),
    project: perBuildProject.module,
  };

  const browserOutput: StrictNullable<BrowserBuildOptions> = (deprecatedBrowserOptions === false || skipBuild.browser || !browserOutputFile) ? null : {
    input: perBuildInput.browser,
    output: browserOutputFile,
    sourcemap: normalizeBuildSourcemap(
      deprecatedBrowserOptions,
      perBuildSourcemap.browser,
    ),
    esModule: normalizeBooleanOption(deprecatedBrowserOptions, 'esModule', perBuildESModule.browser),
    interop: normalizeBooleanOption(deprecatedBrowserOptions, 'interop', perBuildInterop.browser),
    min: normalizeBuildMin(deprecatedBrowserOptions, 'browser', perBuildMin),
    format: (deprecatedBrowserOptions && !isNull(deprecatedBrowserOptions.format) ? deprecatedBrowserOptions.format : browserFormat) || 'umd',
    name: normalizeBuildName(
      cwd,
      deprecatedBrowserOptions ? deprecatedBrowserOptions.name : null,
      browserName,
      packageName,
    ),
    id: deprecatedBrowserOptions && deprecatedBrowserOptions.id || amdId || null,
    globals: normalizeBuildGlobals(
      deprecatedBrowserOptions,
      normalizeGlobals(browserGlobals),
    ),
    extend: !!normalizeBooleanOption(deprecatedBrowserOptions, 'extend', extend as never),
    project: perBuildProject.browser,
  };

  const binaryOutput: StrictNullable<ModuleBuildOptions> = (deprecatedBinaryOptions === false || skipBuild.bin || !binaryOutputFile) ? null : {
    input: perBuildInput.bin,
    output: binaryOutputFile,
    sourcemap: normalizeBuildSourcemap(
      deprecatedBinaryOptions,
      perBuildSourcemap.bin,
    ),
    esModule: normalizeBooleanOption(deprecatedBinaryOptions, 'esModule', perBuildESModule.bin),
    interop: normalizeBooleanOption(deprecatedBinaryOptions, 'interop', perBuildInterop.bin),
    min: normalizeBuildMin(deprecatedBinaryOptions, 'bin', perBuildMin),
    project: perBuildProject.bin,
  };

  const typesOutput: StrictNullable<string> = (deprecatedTypesOptions === false || skipBuild.types || !typesOutputFile) ? null : typesOutputFile;

  const dependencies: Dependencies = {
    runtime: runtimeDependencies || null,
    dev: devDependencies || null,
    peer: peerDependencies || null,
  };

  const cache: StrictNullable<string> = cacheOption || null;

  return {
    cwd,
    pkg,
    main: mainOutput,
    module: moduleOutput,
    browser: browserOutput,
    bin: binaryOutput,
    types: typesOutput,
    dependencies,
    cache,
  };

}

export default analizePkg;
