import { error } from '../errors/error';
import { invalidOption, invalidOptionOld, invalidPkgField } from '../errors/errors';
import { isValidChunks } from '../options/chunks';
import { normalizeBooleanOption } from '../options/deprecated/boolean';
import { isBrowserOption } from '../options/deprecated/browser';
import { isCJSOptionKey } from '../options/deprecated/main-and-bin';
import { isModuleOptionKey } from '../options/deprecated/module';
import { normalizeDeprecatedOption } from '../options/deprecated/normalize';
import { isTypesOptionKey } from '../options/deprecated/types';
import { resolveESModuleOption } from '../options/es-module';
import { isBrowserFormat } from '../options/format';
import { isValidGlobals, normalizeBuildGlobals, normalizeGlobals } from '../options/globals';
import { resolveInputOption } from '../options/input';
import { resolveInteropOption } from '../options/interop';
import { resolveMinOption } from '../options/min';
import { normalizeBuildName } from '../options/name';
import { resolveProjectOption } from '../options/project';
import { resolveSkipOption } from '../options/skip';
import { isSourcemapOption, resolveSourcemapOption } from '../options/sourcemap';
import type { BundlibPkgJson } from '../package/pkg';
import { readPkg } from '../package/read';
import { isDictionaryOrNull, isStringOrNull } from '../type-check/advanced';
import { isDictionary, isNull } from '../type-check/basic';
import { invalidKeys, keysCheck } from '../type-check/keys';
import type { BundlibOptions, TypesOptions } from '../types/bundlib-options';
import type { Dictionary, StrictNullable } from '../types/helper-types';
import type { RollupSourcemap } from '../types/types';
import { loadOptions } from './load-options';
import type { BrowserBuildOptions, Dependencies, ModuleBuildOptions, PkgAnalyzed, TypesBuildOptions } from './pkg-analyzed';

export async function analyzePkg(cwd: string, pkg?: BundlibPkgJson): Promise<PkgAnalyzed>;
export async function analyzePkg(cwd: string, inputPkg?: BundlibPkgJson): Promise<PkgAnalyzed> {

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
      'chunks',
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
    chunks,
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
    equals,
  } = bundlibOptions;

  const perBuildInput = resolveInputOption(bundlibOptions.input);
  const perBuildSourcemap = resolveSourcemapOption(bundlibOptions.sourcemap);
  const perBuildESModule = resolveESModuleOption(bundlibOptions.esModule);
  const perBuildInterop = resolveInteropOption(bundlibOptions.interop);
  const perBuildMin = resolveMinOption(bundlibOptions.min);

  if (!isValidChunks(chunks)) {
    throw invalidOption('chunks');
  }

  if (!isBrowserFormat(browserFormat)) {
    throw invalidOption('format');
  }

  if (!isStringOrNull(browserName)) {
    throw invalidOption('name');
  }

  if (!isStringOrNull(amdId)) {
    throw invalidOption('id');
  }

  if (!isValidGlobals(browserGlobals)) {
    throw invalidOption('globals');
  }

  if (!isStringOrNull(cacheOption)) {
    throw invalidOption('cache');
  }

  const perBuildProject = resolveProjectOption(bundlibOptions.project);
  const skipBuild = resolveSkipOption(bundlibOptions.skip);

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
    sourcemap: normalizeDeprecatedOption(
      deprecatedMainOptions,
      'sourcemap',
      isSourcemapOption,
      perBuildSourcemap.main,
    ),
    esModule: normalizeBooleanOption(deprecatedMainOptions, 'esModule', perBuildESModule.main),
    interop: normalizeBooleanOption(deprecatedMainOptions, 'interop', perBuildInterop.main),
    min: normalizeBooleanOption(deprecatedMainOptions, 'min', perBuildMin.main),
    project: perBuildProject.main,
  };

  const moduleOutput: StrictNullable<ModuleBuildOptions> = (deprecatedModuleOptions === false || skipBuild.module || !moduleOutputFile) ? null : {
    input: perBuildInput.module,
    output: moduleOutputFile,
    sourcemap: normalizeDeprecatedOption(
      deprecatedModuleOptions,
      'sourcemap',
      isSourcemapOption,
      perBuildSourcemap.module,
    ),
    esModule: perBuildESModule.module,
    interop: perBuildInterop.module,
    min: normalizeBooleanOption(deprecatedModuleOptions, 'min', perBuildMin.module),
    project: perBuildProject.module,
  };

  const browserOutput: StrictNullable<BrowserBuildOptions> = (deprecatedBrowserOptions === false || skipBuild.browser || !browserOutputFile) ? null : {
    input: perBuildInput.browser,
    output: browserOutputFile,
    sourcemap: normalizeDeprecatedOption<'sourcemap', RollupSourcemap>(
      deprecatedBrowserOptions,
      'sourcemap',
      isSourcemapOption,
      perBuildSourcemap.browser,
    ),
    esModule: normalizeBooleanOption(deprecatedBrowserOptions, 'esModule', perBuildESModule.browser),
    interop: normalizeBooleanOption(deprecatedBrowserOptions, 'interop', perBuildInterop.browser),
    min: normalizeBooleanOption(deprecatedBrowserOptions, 'min', perBuildMin.browser),
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
    extend: !!normalizeBooleanOption(deprecatedBrowserOptions, 'extend', !!extend),
    project: perBuildProject.browser,
  };

  const binaryOutput: StrictNullable<ModuleBuildOptions> = (deprecatedBinaryOptions === false || skipBuild.bin || !binaryOutputFile) ? null : {
    input: perBuildInput.bin,
    output: binaryOutputFile,
    sourcemap: normalizeDeprecatedOption(
      deprecatedBinaryOptions,
      'sourcemap',
      isSourcemapOption,
      perBuildSourcemap.bin,
    ),
    esModule: normalizeBooleanOption(deprecatedBinaryOptions, 'esModule', perBuildESModule.bin),
    interop: normalizeBooleanOption(deprecatedBinaryOptions, 'interop', perBuildInterop.bin),
    min: normalizeBooleanOption(deprecatedBinaryOptions, 'min', perBuildMin.bin),
    project: perBuildProject.bin,
  };

  const typesOutput: StrictNullable<TypesBuildOptions> = (deprecatedTypesOptions === false || skipBuild.types || !typesOutputFile) ? null : {
    output: typesOutputFile,
    equals: !!equals,
  };

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
    chunks: chunks || null,
    dependencies,
    cache,
  };

}
