import { resolveConfig } from '../config-file/resolve-config';
import { error } from '../errors/error';
import { invalidOptionMessage, invalidPkgFieldMessage } from '../errors/error-messages';
import { resolveESModuleOption } from '../options/es-module';
import { isBrowserFormatOrNullish } from '../options/format';
import { isValidGlobals, normalizeGlobals } from '../options/globals';
import { resolveInputOption } from '../options/input';
import { resolveInteropOption } from '../options/interop';
import { resolveMinOption } from '../options/min';
import { normalizeBuildName } from '../options/name';
import { resolveProjectOption } from '../options/project';
import { resolveSkipOption } from '../options/skip';
import { resolveSourcemapOption } from '../options/sourcemap';
import { readPkg } from '../package/read-pkg';
import { isDictionaryOrNullish, isStringOrNullish } from '../type-check/advanced';
import { invalidKeys } from '../type-check/keys';
import type { BundlibConfig } from '../types/bundlib-options';
import type { BrowserBuildOptions, Dependencies, ModuleBuildOptions, PkgAnalyzed, TypesBuildOptions } from '../types/pkg-analyzed';
import type { BundlibPkgJson } from '../types/pkg-json';

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

  if (!isBrowserFormatOrNullish(browserFormat)) {
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

  if (!isStringOrNullish(pkgMainField)) {
    throw error(invalidPkgFieldMessage('main', 'string'));
  }

  if (!isStringOrNullish(pkgModuleField)) {
    throw error(invalidPkgFieldMessage('module', 'string'));
  }

  if (!pkgModuleField && !isStringOrNullish(pkgJSNextField)) {
    throw error(invalidPkgFieldMessage('jsnext:main', 'string'));
  }

  if (!isStringOrNullish(pkgBrowserField)) {
    throw error(invalidPkgFieldMessage('browser', 'string'));
  }

  if (!isStringOrNullish(pkgBinField)) {
    throw error(invalidPkgFieldMessage('bin', 'string'));
  }

  if (!isDictionaryOrNullish(pkgRuntimeDependencies)) {
    throw error(invalidPkgFieldMessage('dependencies', 'Object'));
  }

  if (!isDictionaryOrNullish(pkgDevDependencies)) {
    throw error(invalidPkgFieldMessage('devDependencies', 'Object'));
  }

  if (!isDictionaryOrNullish(pkgPeerDependencies)) {
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

  const mainOutput: ModuleBuildOptions | null = (skipBuild.main || !pkgMainField)
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

  const moduleOutput: ModuleBuildOptions | null = (skipBuild.module || !moduleOutputFile)
    ? null
    : {
      input: moduleInput,
      output: moduleOutputFile,
      sourcemap: perBuildSourcemap.module,
      esModule: perBuildESModule.module,
      interop: perBuildInterop.module,
      min: perBuildMin.module,
      project: perBuildProject.module,
    };

  const browserOutput: BrowserBuildOptions | null = (skipBuild.browser || !pkgBrowserField)
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
      extend: !!extend,
      project: perBuildProject.browser,
    };

  const binaryOutput: ModuleBuildOptions | null = (skipBuild.bin || !pkgBinField)
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

  const typesOutput: TypesBuildOptions | null = (skipBuild.types || !typesOutputFile)
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

  const cache: string | null = cacheOption ?? null;

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
