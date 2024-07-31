import { error } from '../errors/error';
import { invalidDeprecatedOptionMessage, invalidOptionMessage, invalidPkgFieldMessage } from '../errors/error-messages';
import { normalizeBooleanOption } from '../options/deprecated/boolean';
import { isBrowserOptionKey } from '../options/deprecated/browser';
import { isCJSOptionKey } from '../options/deprecated/commonjs';
import { isModuleOptionKey } from '../options/deprecated/module';
import { normalizeDeprecatedOption } from '../options/deprecated/normalize';
import { isTypesOptionKey } from '../options/deprecated/types';
import { isEsModuleOption, resolveESModuleOption } from '../options/es-module';
import { isBrowserFormat } from '../options/format';
import { isValidGlobals, normalizeBuildGlobals, normalizeGlobals } from '../options/globals';
import { resolveInputOption } from '../options/input';
import { isInteropOption, resolveInteropOption } from '../options/interop';
import { resolveMinOption } from '../options/min';
import { normalizeBuildName } from '../options/name';
import { resolveProjectOption } from '../options/project';
import { resolveSkipOption } from '../options/skip';
import { isSourcemapOption, resolveSourcemapOption } from '../options/sourcemap';
import { readPkg } from '../package/read-pkg';
import { isDictionaryOrNullish, isStringOrNullish } from '../type-check/advanced';
import { isDictionary, isNullish } from '../type-check/basic';
import { invalidKeys, keysCheck } from '../type-check/keys';
import type { DeprecatedTypesOptions } from '../types/deprecated-options';
import type { AllowNull, Dictionary, Nullish } from '../types/helper-types';
import type { BrowserBuildOptions, Dependencies, ModuleBuildOptions, PkgAnalyzed, TypesBuildOptions } from '../types/pkg-analyzed';
import type { BundlibPkgJson } from '../types/pkg-json';
import type { RollupBundlibInterop, RollupEsModuleOption, RollupSourcemap } from '../types/types';
import { resolveConfig } from './resolve-config';

export async function analyzePkg2(cwd: string, pkg: BundlibPkgJson): Promise<PkgAnalyzed> {

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
    bundlib: pkgBundlibConfig,
  } = pkg;

  const resolvedBundlibConfig = await resolveConfig(cwd, pkgBundlibConfig);

  const invalidOptions = invalidKeys(
    resolvedBundlibConfig,
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
  } = resolvedBundlibConfig;

  const perBuildInput = resolveInputOption(resolvedBundlibConfig.input);
  const perBuildSourcemap = resolveSourcemapOption(resolvedBundlibConfig.sourcemap);
  const perBuildESModule = resolveESModuleOption(resolvedBundlibConfig.esModule);
  const perBuildInterop = resolveInteropOption(resolvedBundlibConfig.interop);
  const perBuildMin = resolveMinOption(resolvedBundlibConfig.min);

  if (!isDictionaryOrNullish(chunks)) {
    throw error(invalidOptionMessage('chunks'));
  }

  if (!isBrowserFormat(browserFormat)) {
    throw error(invalidOptionMessage('format'));
  }

  if (!isStringOrNullish(browserName)) {
    throw error(invalidOptionMessage('name'));
  }

  if (!isStringOrNullish(amdId)) {
    throw error(invalidOptionMessage('id'));
  }

  if (!isValidGlobals(browserGlobals)) {
    throw error(invalidOptionMessage('globals'));
  }

  if (!isStringOrNullish(cacheOption)) {
    throw error(invalidOptionMessage('cache'));
  }

  const perBuildProject = resolveProjectOption(resolvedBundlibConfig.project);
  const skipBuild = resolveSkipOption(resolvedBundlibConfig.skip);

  if (
    !isNullish(deprecatedMainOptions) && (deprecatedMainOptions !== false) && !(
      isDictionary<ModuleBuildOptions>(deprecatedMainOptions)
      && keysCheck(deprecatedMainOptions, isCJSOptionKey)
    )
  ) {
    throw error(invalidDeprecatedOptionMessage(
      'main',
      'false | { sourcemap?: boolean | "inline", esModule?: boolean, interop?: boolean, min?: boolean }',
    ));
  }

  if (
    !isNullish(deprecatedModuleOptions) && (deprecatedModuleOptions !== false) && !(
      isDictionary<ModuleBuildOptions>(deprecatedModuleOptions)
      && keysCheck(deprecatedModuleOptions, isModuleOptionKey)
    )
  ) {
    throw error(invalidDeprecatedOptionMessage(
      'module',
      'false | { sourcemap?: boolean | "inline", min?: boolean }',
    ));
  }

  if (
    !isNullish(deprecatedBrowserOptions) && (deprecatedBrowserOptions !== false) && !(
      isDictionary<BrowserBuildOptions>(deprecatedBrowserOptions)
      && keysCheck(deprecatedBrowserOptions, isBrowserOptionKey)
      && isBrowserFormat(deprecatedBrowserOptions.format)
      && (['name', 'id'] as Array<keyof typeof deprecatedBrowserOptions>).every((key) => (
        isStringOrNullish(deprecatedBrowserOptions[key])
      ))
      && isValidGlobals(deprecatedBrowserOptions.globals)
    )
  ) {
    throw error(invalidDeprecatedOptionMessage(
      'browser',
      'false | { sourcemap?: boolean | "inline", esModule?: boolean, interop?: boolean, min?: boolean, ... }',
    ));
  }

  if (
    !isNullish(deprecatedBinaryOptions) && (deprecatedBinaryOptions !== false) && !(
      isDictionary<ModuleBuildOptions>(deprecatedBinaryOptions)
      && keysCheck(deprecatedBinaryOptions, isCJSOptionKey)
    )
  ) {
    throw error(invalidDeprecatedOptionMessage(
      'bin',
      'false | { sourcemap?: boolean | "inline", esModule?: boolean, interop?: boolean, min?: boolean }',
    ));
  }

  if (
    !isNullish(deprecatedTypesOptions) && (deprecatedTypesOptions !== false) && !(
      isDictionary<DeprecatedTypesOptions>(deprecatedTypesOptions)
      && keysCheck(deprecatedTypesOptions, isTypesOptionKey)
    )
  ) {
    throw error(invalidDeprecatedOptionMessage('types', 'false | { equals?: boolean }'));
  }

  if ((deprecatedMainOptions !== false) && !isStringOrNullish(mainOutputFile)) {
    throw error(invalidPkgFieldMessage('main', 'string'));
  }

  if ((deprecatedModuleOptions !== false) && !isStringOrNullish(moduleFieldValue)) {
    throw error(invalidPkgFieldMessage('module', 'string'));
  }

  if (!moduleFieldValue && (deprecatedModuleOptions !== false) && !isStringOrNullish(jsNextFieldValue)) {
    throw error(invalidPkgFieldMessage('jsnext:main', 'string'));
  }

  if ((deprecatedBrowserOptions !== false) && !isStringOrNullish(browserOutputFile)) {
    throw error(invalidPkgFieldMessage('browser', 'string'));
  }

  if ((deprecatedBinaryOptions !== false) && !isStringOrNullish(binaryOutputFile)) {
    throw error(invalidPkgFieldMessage('bin', 'string'));
  }

  if (!isDictionaryOrNullish<Dictionary<string> | Nullish>(runtimeDependencies)) {
    throw error(invalidPkgFieldMessage('dependencies', 'Object'));
  }

  if (!isDictionaryOrNullish<Dictionary<string> | Nullish>(devDependencies)) {
    throw error(invalidPkgFieldMessage('devDependencies', 'Object'));
  }

  if (!isDictionaryOrNullish<Dictionary<string> | Nullish>(peerDependencies)) {
    throw error(invalidPkgFieldMessage('peerDependencies', 'Object'));
  }

  const moduleOutputFile = moduleFieldValue ?? jsNextFieldValue;

  const typesOutputFile = typesFieldValue ?? typings;

  const mainOutput: AllowNull<ModuleBuildOptions> = (deprecatedMainOptions === false || skipBuild.main || !mainOutputFile)
    ? null
    : {
      input: perBuildInput.main,
      output: mainOutputFile,
      sourcemap: normalizeDeprecatedOption<'sourcemap', RollupSourcemap>(
        deprecatedMainOptions,
        'sourcemap',
        isSourcemapOption,
        perBuildSourcemap.main,
      ),
      esModule: normalizeDeprecatedOption<'esModule', RollupEsModuleOption>(deprecatedMainOptions, 'esModule', isEsModuleOption, perBuildESModule.main),
      interop: normalizeDeprecatedOption<'interop', RollupBundlibInterop>(deprecatedMainOptions, 'interop', isInteropOption, perBuildInterop.main),
      min: normalizeBooleanOption(deprecatedMainOptions, 'min', perBuildMin.main),
      project: perBuildProject.main,
    };

  const moduleOutput: AllowNull<ModuleBuildOptions> = (deprecatedModuleOptions === false || skipBuild.module || !moduleOutputFile)
    ? null
    : {
      input: perBuildInput.module,
      output: moduleOutputFile,
      sourcemap: normalizeDeprecatedOption<'sourcemap', RollupSourcemap>(
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

  const browserOutput: AllowNull<BrowserBuildOptions> = (deprecatedBrowserOptions === false || skipBuild.browser || !browserOutputFile)
    ? null
    : {
      input: perBuildInput.browser,
      output: browserOutputFile,
      sourcemap: normalizeDeprecatedOption<'sourcemap', RollupSourcemap>(
        deprecatedBrowserOptions,
        'sourcemap',
        isSourcemapOption,
        perBuildSourcemap.browser,
      ),
      esModule: normalizeDeprecatedOption<'esModule', RollupEsModuleOption>(
        deprecatedBrowserOptions,
        'esModule',
        isEsModuleOption,
        perBuildESModule.browser,
      ),
      interop: normalizeDeprecatedOption<'interop', RollupBundlibInterop>(
        deprecatedBrowserOptions,
        'interop',
        isInteropOption,
        perBuildInterop.browser,
      ),
      min: normalizeBooleanOption(deprecatedBrowserOptions, 'min', perBuildMin.browser),
      format: (deprecatedBrowserOptions && !isNullish(deprecatedBrowserOptions.format) ? deprecatedBrowserOptions.format : browserFormat) ?? 'umd',
      name: normalizeBuildName(
        cwd,
        deprecatedBrowserOptions ? deprecatedBrowserOptions.name : null,
        browserName,
        packageName,
      ),
      id: ((deprecatedBrowserOptions && deprecatedBrowserOptions.id) ?? amdId) ?? null,
      globals: normalizeBuildGlobals(
        deprecatedBrowserOptions,
        normalizeGlobals(browserGlobals),
      ),
      extend: !!normalizeBooleanOption(deprecatedBrowserOptions, 'extend', !!extend),
      project: perBuildProject.browser,
    };

  const binaryOutput: AllowNull<ModuleBuildOptions> = (deprecatedBinaryOptions === false || skipBuild.bin || !binaryOutputFile)
    ? null
    : {
      input: perBuildInput.bin,
      output: binaryOutputFile,
      sourcemap: normalizeDeprecatedOption<'sourcemap', RollupSourcemap>(
        deprecatedBinaryOptions,
        'sourcemap',
        isSourcemapOption,
        perBuildSourcemap.bin,
      ),
      esModule: normalizeDeprecatedOption<'esModule', RollupEsModuleOption>(
        deprecatedBinaryOptions,
        'esModule',
        isEsModuleOption,
        perBuildESModule.bin,
      ),
      interop: normalizeDeprecatedOption<'interop', RollupBundlibInterop>(
        deprecatedBinaryOptions,
        'interop',
        isInteropOption,
        perBuildInterop.bin,
      ),
      min: normalizeBooleanOption(deprecatedBinaryOptions, 'min', perBuildMin.bin),
      project: perBuildProject.bin,
    };

  const typesOutput: AllowNull<TypesBuildOptions> = (deprecatedTypesOptions === false || skipBuild.types || !typesOutputFile)
    ? null
    : {
      output: typesOutputFile,
      equals: !!equals,
    };

  const dependencies: Dependencies = {
    runtime: runtimeDependencies ?? null,
    dev: devDependencies ?? null,
    peer: peerDependencies ?? null,
  };

  const cache: AllowNull<string> = cacheOption ?? null;

  return {
    cwd,
    pkg,
    main: mainOutput,
    module: moduleOutput,
    browser: browserOutput,
    bin: binaryOutput,
    types: typesOutput,
    chunks: chunks ?? null,
    dependencies,
    cache,
  };

}

export async function analyzePkg(cwd: string, inputPkg?: BundlibPkgJson): Promise<PkgAnalyzed> {
  if (inputPkg) {
    return analyzePkg2(cwd, inputPkg);
  }
  const pkg = await readPkg(cwd);
  return analyzePkg2(cwd, pkg);
}
