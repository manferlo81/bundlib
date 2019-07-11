
import { resolve } from "path";
import readPkg from "read-pkg";

import { BundlibOptions } from "./bundlib-options";
import { error, invalidOption, invalidPkgField } from "./errors";
import keysOrNull from "./keys-or-null";
import keys from "./obj-keys";
import { normalizeBuildFlag } from "./option-flag";
import { isBrowserFormat } from "./option-format";
import { isValidGlobals, normalizeBuildGlobals, normalizeGlobals } from "./option-globals";
import { isValidMinOption, normalizeBuildMin, normalizeMin } from "./option-min";
import normalizeBuildName from "./option-name";
import { normalizeBuildSourcemap, normalizeSourcemap } from "./options-sourcemap";
import { BundlibPkgJson } from "./pkg";
import {
  BrowserBuildOptions,
  CommonJSBuildOptions,
  Dependencies,
  ESModuleBuildOptions,
  InputOptions,
  MinifyOptions,
  OutputOptions,
  PkgAnalized,
  TypesBuildOptions,
} from "./pkg-analized";
import { isBool, isDictionary, isDictionaryOrNull, isNull, isString, isStringOrNull } from "./type-check";
import { invalidKeys } from "./validate-options";

async function analizePkg(cwd: string, pkg?: BundlibPkgJson): Promise<PkgAnalized>;
async function analizePkg(cwd: string, inputPkg?: BundlibPkgJson): Promise<PkgAnalized> {

  const pkg: BundlibPkgJson = inputPkg || await readPkg({ cwd, normalize: false });

  if (!isDictionary(pkg)) {
    throw error("Invalid package.json content");
  }

  const {
    name: pkgName,
    main: pkgMain,
    module: pkgModule,
    "jsnext:main": pkgJsNextMain,
    browser: pkgBrowser,
    bin: pkgBin,
    types: pkgTypes,
    typings,
    dependencies: runtimeDependencies,
    peerDependencies,
    optionalDependencies,
    bundlib: bundlibOptions,
  } = pkg;

  if (!isStringOrNull(pkgMain)) {
    throw invalidPkgField("main", "string");
  }

  if (!isStringOrNull(pkgModule)) {
    throw invalidPkgField("module", "string");
  }

  if (!isStringOrNull(pkgJsNextMain) && !pkgModule) {
    throw invalidPkgField("jsnext:main", "string");
  }

  if (!isStringOrNull(pkgBrowser)) {
    throw invalidPkgField("browser", "string");
  }

  if (!isStringOrNull(pkgBin)) {
    throw invalidPkgField("bin", "string");
  }

  if (!isDictionaryOrNull(bundlibOptions)) {
    throw invalidPkgField("bundlib", "Object");
  }

  if (!isDictionaryOrNull(runtimeDependencies)) {
    throw invalidPkgField("dependencies", "Object");
  }

  if (!isDictionaryOrNull(peerDependencies)) {
    throw invalidPkgField("peerDependencies", "Object");
  }

  if (!isDictionaryOrNull(optionalDependencies)) {
    throw invalidPkgField("optionalDependencies", "Object");
  }

  const invalidOptions = bundlibOptions && invalidKeys(bundlibOptions, [
    "input",
    "extend",
    "esModule",
    "interop",
    "equals",
    "sourcemap",
    "format",
    "name",
    "id",
    "globals",
    "min",
    "cache",
    "main",
    "module",
    "browser",
    "bin",
    "types",
  ] as Array<keyof BundlibOptions>);
  if (invalidOptions) {
    const optionNames = invalidOptions.map((name) => `"${name}"`).join(", ");
    throw error(`Unknown options found: (${optionNames})`);
  }

  const {
    input: inputOption,
    sourcemap: sourcemapOption,
    esModule,
    interop,
    extend,
    equals,
    format: browserFormat,
    name: browserName,
    id: amdId,
    globals: browserGlobals,
    min,
    cache: cacheOption,
    main: mainOptions,
    module: moduleOptions,
    browser: browserOptions,
    bin: binaryOptionsOrInput,
    types: typesOptions,
  } = bundlibOptions || {} as BundlibOptions;

  if (
    !isNull(inputOption) && !isString(inputOption) && !(
      isDictionary(inputOption) && !invalidKeys(inputOption, ["api", "bin"]) && keys(inputOption).every((key) => (
        isString(inputOption[key])
      ))
    )
  ) {
    throw invalidOption("input", "string | { api?: string, bin?: string }");
  }

  if (!isNull(sourcemapOption) && !isBool(sourcemapOption) && sourcemapOption !== "inline") {
    throw invalidOption("sourcemap", 'boolean | "inline"');
  }

  if (!isBrowserFormat(browserFormat)) {
    throw invalidOption("format", '"amd" | "iife" | "amd"');
  }

  if (!isStringOrNull(browserName)) {
    throw invalidOption("name", "string");
  }

  if (!isStringOrNull(amdId)) {
    throw invalidOption("id", "string");
  }

  if (!isValidGlobals(browserGlobals)) {
    throw invalidOption("globals", "Object<string, string> | string[]");
  }

  if (!isValidMinOption(min)) {
    throw invalidOption("min", 'boolean | "main" | "module" | "browser" | Array<"main" | "module" | "browser">');
  }

  if (!isStringOrNull(cacheOption)) {
    throw invalidOption("cache", "string");
  }

  if (
    !isNull(mainOptions) && (mainOptions !== false) && !(
      isDictionary(mainOptions) && !invalidKeys(mainOptions, [
        "sourcemap",
        "esModule",
        "interop",
        "min",
      ])
    )
  ) {
    throw invalidOption("main", 'false | { sourcemap?: boolean | "inline", esModule?, interop?, min? }');
  }

  if (
    !isNull(moduleOptions) && (moduleOptions !== false) && !(
      isDictionary(moduleOptions) && !invalidKeys(moduleOptions, [
        "sourcemap",
        "min",
      ])
    )
  ) {
    throw invalidOption("module", 'false | { sourcemap?: boolean | "inline", min? }');
  }

  if (
    !isNull(browserOptions) && (browserOptions !== false) && !(
      isDictionary(browserOptions) && !invalidKeys(browserOptions, [
        "sourcemap",
        "esModule",
        "interop",
        "min",
        "format",
        "name",
        "id",
        "globals",
        "extend",
      ]) &&
      isBrowserFormat(browserOptions.format) &&
      (["name", "id"] as Array<keyof typeof browserOptions>).every((key) => (
        isStringOrNull(browserOptions[key])
      )) &&
      isValidGlobals(browserOptions.globals)
    )
  ) {
    throw invalidOption("browser", 'false | { sourcemap?: boolean | "inline", esModule?, interop?, min? }');
  }

  if (
    !isNull(binaryOptionsOrInput) && !isString(binaryOptionsOrInput) && (binaryOptionsOrInput !== false) && !(
      isDictionary(binaryOptionsOrInput) && !invalidKeys(binaryOptionsOrInput, [
        "sourcemap",
        "esModule",
        "interop",
        "min",
      ])
    )
  ) {
    throw invalidOption("bin", 'string | false | { sourcemap?: boolean | "inline", esModule?, interop?, min? }');
  }

  if (
    !isNull(typesOptions) && (typesOptions !== false) && !(
      isDictionary(typesOptions) && !invalidKeys(typesOptions, [
        "equals",
      ])
    )
  ) {
    throw invalidOption("types", "false");
  }

  const globalESModule = !!esModule;
  const globalInterop = !!interop;

  const esModuleFile = pkgModule || pkgJsNextMain;
  const typesPath = pkgTypes || typings;

  const apiInput = isStringOrNull(inputOption) ? inputOption : inputOption.api;
  let binInput = isStringOrNull(inputOption) ? null : inputOption.bin;

  // falling back to "bin" option is "string" but this behavior will change in the future
  if (isString(binaryOptionsOrInput) && !binInput) {
    binInput = binaryOptionsOrInput;
  }

  const input: InputOptions = {
    api: resolve(cwd, apiInput || "src/index.ts"),
    bin: resolve(cwd, binInput || "src-bin/index.ts"),
  };

  const globalSourcemap = normalizeSourcemap(sourcemapOption);
  const globalMin: MinifyOptions = normalizeMin(min);

  const mainOutput: CommonJSBuildOptions | null = (mainOptions === false || !pkgMain) ? null : {
    path: resolve(cwd, pkgMain),
    sourcemap: normalizeBuildSourcemap(
      mainOptions,
      globalSourcemap,
    ),
    esModule: normalizeBuildFlag(mainOptions, "esModule", globalESModule),
    interop: normalizeBuildFlag(mainOptions, "interop", globalInterop),
    min: normalizeBuildMin(mainOptions, "main", globalMin),
  };

  const moduleOutput: ESModuleBuildOptions | null = (moduleOptions === false || !esModuleFile) ? null : {
    path: resolve(cwd, esModuleFile),
    sourcemap: normalizeBuildSourcemap(
      moduleOptions,
      globalSourcemap,
    ),
    min: normalizeBuildMin(moduleOptions, "module", globalMin),
  };

  const browserOutput: BrowserBuildOptions | null = (browserOptions === false || !pkgBrowser) ? null : {
    path: resolve(cwd, pkgBrowser),
    sourcemap: normalizeBuildSourcemap(
      browserOptions,
      globalSourcemap,
    ),
    esModule: normalizeBuildFlag(browserOptions, "esModule", globalESModule),
    interop: normalizeBuildFlag(browserOptions, "interop", globalInterop),
    min: normalizeBuildMin(browserOptions, "browser", globalMin),
    format: browserOptions && !isNull(browserOptions.format) ? browserOptions.format : (browserFormat || "umd"),
    name: normalizeBuildName(
      cwd,
      browserOptions ? browserOptions.name : null,
      browserName,
      pkgName,
    ),
    id: amdId || null,
    globals: normalizeBuildGlobals(
      browserOptions,
      normalizeGlobals(browserGlobals),
    ),
    extend: normalizeBuildFlag(browserOptions, "extend", !!extend),
  };

  const binaryOptions = isString(binaryOptionsOrInput) ? null : binaryOptionsOrInput;

  const binaryOutput: CommonJSBuildOptions | null = (
    binaryOptions === false || !pkgBin
  )
    ? null : {
      path: resolve(cwd, pkgBin),
      sourcemap: normalizeBuildSourcemap(
        binaryOptions,
        globalSourcemap,
      ),
      esModule: normalizeBuildFlag(binaryOptions, "esModule", globalESModule),
      interop: normalizeBuildFlag(binaryOptions, "interop", globalInterop),
      min: normalizeBuildMin(binaryOptions, "bin", globalMin),
    };

  const typesOutput: TypesBuildOptions | null = (typesOptions === false || !typesPath)
    ? null : {
      path: resolve(cwd, typesPath),
      equals: normalizeBuildFlag(typesOptions, "equals", !!equals),
    };

  const output: OutputOptions = {
    main: mainOutput,
    module: moduleOutput,
    browser: browserOutput,
    bin: binaryOutput,
    types: typesOutput,
  };

  const dependencies: Dependencies = {
    runtime: keysOrNull(runtimeDependencies),
    peer: keysOrNull(peerDependencies),
    optional: keysOrNull(optionalDependencies),
  };

  const cache: string = resolve(cwd, cacheOption || "node_modules/.cache/bundlib");

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
