import { error } from '../errors/error';
import { invalidDeprecatedOptionMessage, invalidOptionMessage, invalidPkgFieldMessage } from '../errors/error-messages';
import { normalizeBooleanOption } from '../options/deprecated/boolean';
import { isModuleOptionKey } from '../options/deprecated/module';
import { normalizeDeprecatedOption } from '../options/deprecated/normalize';
import { resolveESModuleOption } from '../options/es-module';
import { isBrowserFormat } from '../options/format';
import { isValidGlobals, normalizeGlobals } from '../options/globals';
import { resolveInputOption } from '../options/input';
import { resolveInteropOption } from '../options/interop';
import { resolveMinOption } from '../options/min';
import { normalizeBuildName } from '../options/name';
import { resolveProjectOption } from '../options/project';
import { resolveSkipOption } from '../options/skip';
import { isSourcemapOption, resolveSourcemapOption } from '../options/sourcemap';
import { readPkg } from '../package/read-pkg';
import { isDictionaryOrNullish, isStringOrNullish } from '../type-check/advanced';
import { isDictionary, isNullish } from '../type-check/basic';
import { invalidKeys, keysCheck } from '../type-check/keys';
import type { BundlibConfig } from '../types/bundlib-options';
import type { AllowNull, Dictionary, Nullish } from '../types/helper-types';
import type { BrowserBuildOptions, Dependencies, ModuleBuildOptions, PkgAnalyzed, TypesBuildOptions } from '../types/pkg-analyzed';
import type { BundlibPkgJson } from '../types/pkg-json';
import type { RollupSourcemap } from '../types/rollup';
import { resolveConfig } from './resolve-config';

export async function analyzePkg2(cwd: string, pkg: BundlibPkgJson): Promise<PkgAnalyzed> {

  const {
    name: pkgName,
    main: pkgMainField,
    module: pkgModuleField,
    'jsnext:main': pkgJSNextField,
    browser: pkgBrowserField,
    bin: pkgBinField,
    types: pkgTypesField,
    typings: pkgTypingsField,
    dependencies: pkgRuntimeDependencies,
    devDependencies: pkgDevDependencies,
    peerDependencies: pkgPeerDependencies,
    bundlib: pkgBundlibConfig,
  } = pkg;

  const resolvedBundlibConfig = await resolveConfig(cwd, pkgBundlibConfig);

  const invalidOptions = invalidKeys<keyof BundlibConfig>(
    resolvedBundlibConfig as Readonly<Record<keyof BundlibConfig, unknown>>,
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
      'module',
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
    module: deprecatedModuleOptions,
    equals,
    input: inputOption,
    sourcemap: sourcemapOption,
    esModule: esModuleOption,
    interop: interopOption,
    min: minOption,
    project: projectOption,
    skip: skipOption,
  } = resolvedBundlibConfig;

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

  if (!isStringOrNullish(pkgMainField)) {
    throw error(invalidPkgFieldMessage('main', 'string'));
  }

  if ((deprecatedModuleOptions !== false) && !isStringOrNullish(pkgModuleField)) {
    throw error(invalidPkgFieldMessage('module', 'string'));
  }

  if (!pkgModuleField && (deprecatedModuleOptions !== false) && !isStringOrNullish(pkgJSNextField)) {
    throw error(invalidPkgFieldMessage('jsnext:main', 'string'));
  }

  if (!isStringOrNullish(pkgBrowserField)) {
    throw error(invalidPkgFieldMessage('browser', 'string'));
  }

  if (!isStringOrNullish(pkgBinField)) {
    throw error(invalidPkgFieldMessage('bin', 'string'));
  }

  if (!isDictionaryOrNullish<Dictionary<string> | Nullish>(pkgRuntimeDependencies)) {
    throw error(invalidPkgFieldMessage('dependencies', 'Object'));
  }

  if (!isDictionaryOrNullish<Dictionary<string> | Nullish>(pkgDevDependencies)) {
    throw error(invalidPkgFieldMessage('devDependencies', 'Object'));
  }

  if (!isDictionaryOrNullish<Dictionary<string> | Nullish>(pkgPeerDependencies)) {
    throw error(invalidPkgFieldMessage('peerDependencies', 'Object'));
  }

  const { main: mainInput, module: moduleInput, browser: browserInput, bin: binInput } = resolveInputOption(inputOption);
  const perBuildSourcemap = resolveSourcemapOption(sourcemapOption);
  const perBuildESModule = resolveESModuleOption(esModuleOption);
  const perBuildInterop = resolveInteropOption(interopOption);
  const perBuildMin = resolveMinOption(minOption);

  const perBuildProject = resolveProjectOption(projectOption);
  const skipBuild = resolveSkipOption(skipOption);

  const moduleOutputFile = pkgModuleField ?? pkgJSNextField;

  const typesOutputFile = pkgTypesField ?? pkgTypingsField;

  const mainOutput: AllowNull<ModuleBuildOptions> = (skipBuild.main || !pkgMainField)
    ? null
    : {
      input: mainInput,
      output: pkgMainField,
      sourcemap: perBuildSourcemap.main,
      esModule: perBuildESModule.main,
      interop: perBuildInterop.main,
      min: perBuildMin.main,
      project: perBuildProject.main,
    };

  const moduleOutput: AllowNull<ModuleBuildOptions> = (deprecatedModuleOptions === false || skipBuild.module || !moduleOutputFile)
    ? null
    : {
      input: moduleInput,
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

  const browserOutput: AllowNull<BrowserBuildOptions> = (skipBuild.browser || !pkgBrowserField)
    ? null
    : {
      input: browserInput,
      output: pkgBrowserField,
      sourcemap: perBuildSourcemap.browser,
      esModule: perBuildESModule.browser,
      interop: perBuildInterop.browser,
      min: perBuildMin.browser,
      format: browserFormat ?? 'umd',
      name: normalizeBuildName(
        browserName,
        pkgName,
        cwd,
      ),
      id: amdId ?? null,
      globals: normalizeGlobals(browserGlobals),
      extend: !!normalizeBooleanOption(null, 'extend', !!extend),
      project: perBuildProject.browser,
    };

  const binaryOutput: AllowNull<ModuleBuildOptions> = (skipBuild.bin || !pkgBinField)
    ? null
    : {
      input: binInput,
      output: pkgBinField,
      sourcemap: perBuildSourcemap.bin,
      esModule: perBuildESModule.bin,
      interop: perBuildInterop.bin,
      min: perBuildMin.bin,
      project: perBuildProject.bin,
    };

  const typesOutput: AllowNull<TypesBuildOptions> = (skipBuild.types || !typesOutputFile)
    ? null
    : {
      output: typesOutputFile,
      equals: !!equals,
    };

  const dependencies: Dependencies = {
    runtime: pkgRuntimeDependencies ?? null,
    dev: pkgDevDependencies ?? null,
    peer: pkgPeerDependencies ?? null,
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
