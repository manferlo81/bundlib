
import { resolve } from "path";
import readPkg from "read-pkg";

import { BundlibOptions } from "./bundlib-options";
import { error, invalidOption, invalidPkgField } from "./errors";
import keysOrNull from "./keys-or-null";
import keys from "./obj-keys";
import { normalizeBuildFlag } from "./option-flag";
import { isBrowserFormat } from "./option-format";
import { isValidGlobals, normalizeBuildGlobals, normalizeGlobals } from "./option-globals";
import { isValidMinOption, MinGlobal, normalizeBuildMin, normalizeMinOption } from "./option-min";
import { isModuleOption, normalizeBuildModule, normalizeModuleOption } from "./option-module";
import normalizeBuildName from "./option-name";
import { normalizeBuildSourcemap, normalizeSourcemap } from "./options-sourcemap";
import { BundlibPkgJson } from "./pkg";
import {
  BrowserBuildOptions,
  CommonJSBuildOptions,
  Dependencies,
  ESModuleBuildOptions,
  InputOptions,
  OutputOptions,
  PkgAnalized,
  TypesBuildOptions,
} from "./pkg-analized";
import { isBool, isDictionary, isDictionaryOrNull, isNull, isString, isStringOrNull } from "./type-check";
import { allKeysInList, invalidKeys } from "./validate-keys";

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

  if (!isDictionaryOrNull(bundlibOptions)) {
    throw invalidPkgField("bundlib", "Object");
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

  const binaryOptions = isString(binaryOptionsOrInput) ? null : binaryOptionsOrInput;

  if (
    !isStringOrNull(inputOption) && !(
      isDictionary(inputOption) && allKeysInList(inputOption, ["api", "bin"]) && keys(inputOption).every((key) => (
        isString(inputOption[key])
      ))
    )
  ) {
    throw invalidOption("input", "string | { api?: string, bin?: string }");
  }

  if (!isNull(sourcemapOption) && !isBool(sourcemapOption) && sourcemapOption !== "inline") {
    throw invalidOption("sourcemap", 'boolean | "inline"');
  }

  if (!isModuleOption(esModule)) {
    throw invalidOption(
      "esModule",
      'boolean | "main" | "browser" | "bin" | Array<"main" | "browser" | "bin">',
    );
  }

  if (!isModuleOption(interop)) {
    throw invalidOption(
      "interop",
      'boolean | "main" | "browser" | "bin" | Array<"main" | "browser" | "bin">',
    );
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
    throw invalidOption(
      "globals",
      "Object<string, string> | string[]",
    );
  }

  if (!isValidMinOption(min)) {
    throw invalidOption(
      "min",
      'boolean | "main" | "module" | "browser" | "bin" | Array<"main" | "module" | "browser" | "bin">',
    );
  }

  if (!isStringOrNull(cacheOption)) {
    throw invalidOption("cache", "string");
  }

  if (
    !isNull(mainOptions) && (mainOptions !== false) && !(
      isDictionary(mainOptions) && allKeysInList(mainOptions, [
        "sourcemap",
        "esModule",
        "interop",
        "min",
      ])
    )
  ) {
    throw invalidOption(
      "main",
      'false | { sourcemap?: boolean | "inline", esModule?: boolean, interop?: boolean, min?: boolean }',
    );
  }

  if (
    !isNull(moduleOptions) && (moduleOptions !== false) && !(
      isDictionary(moduleOptions) && allKeysInList(moduleOptions, [
        "sourcemap",
        "min",
      ])
    )
  ) {
    throw invalidOption(
      "module",
      'false | { sourcemap?: boolean | "inline", min?: boolean }',
    );
  }

  if (
    !isNull(browserOptions) && (browserOptions !== false) && !(
      isDictionary(browserOptions) && allKeysInList(browserOptions, [
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
    throw invalidOption(
      "browser",
      'false | { sourcemap?: boolean | "inline", esModule?: boolean, interop?: boolean, min?: boolean, ... }',
    );
  }

  // "bin" options as string is deprecated
  // after removed it should throw if it's string
  // !isString(binaryOptionsOrInput) will be removed...
  if (
    !isNull(binaryOptionsOrInput) && !isString(binaryOptionsOrInput) && (binaryOptionsOrInput !== false) && !(
      isDictionary(binaryOptionsOrInput) && allKeysInList(binaryOptionsOrInput, [
        "sourcemap",
        "esModule",
        "interop",
        "min",
      ])
    )
  ) {
    throw invalidOption(
      "bin",
      'false | { sourcemap?: boolean | "inline", esModule?: boolean, interop?: boolean, min?: boolean }',
    );
  }

  if (
    !isNull(typesOptions) && (typesOptions !== false) && !(
      isDictionary(typesOptions) && allKeysInList(typesOptions, [
        "equals",
      ])
    )
  ) {
    throw invalidOption("types", "false | { equals?: boolean }");
  }

  if ((mainOptions !== false) && !isStringOrNull(pkgMain)) {
    throw invalidPkgField("main", "string");
  }

  if ((moduleOptions !== false) && !isStringOrNull(pkgModule)) {
    throw invalidPkgField("module", "string");
  }

  if (!pkgModule && (moduleOptions !== false) && !isStringOrNull(pkgJsNextMain)) {
    throw invalidPkgField("jsnext:main", "string");
  }

  if ((browserOptions !== false) && !isStringOrNull(pkgBrowser)) {
    throw invalidPkgField("browser", "string");
  }

  if ((binaryOptions !== false) && !isStringOrNull(pkgBin)) {
    throw invalidPkgField("bin", "string");
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
  const globalESModule = normalizeModuleOption(esModule);
  const globalInterop = normalizeModuleOption(interop);
  const globalMin: MinGlobal = normalizeMinOption(min);

  const mainOutput: CommonJSBuildOptions | null = (mainOptions === false || !pkgMain) ? null : {
    path: resolve(cwd, pkgMain),
    sourcemap: normalizeBuildSourcemap(
      mainOptions,
      globalSourcemap,
    ),
    esModule: normalizeBuildModule(mainOptions, "esModule", "main", globalESModule),
    interop: normalizeBuildModule(mainOptions, "interop", "main", globalInterop),
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
    path: resolve(cwd, pkgBrowser as string),
    sourcemap: normalizeBuildSourcemap(
      browserOptions,
      globalSourcemap,
    ),
    esModule: normalizeBuildModule(browserOptions, "esModule", "browser", globalESModule),
    interop: normalizeBuildModule(browserOptions, "interop", "browser", globalInterop),
    min: normalizeBuildMin(browserOptions, "browser", globalMin),
    format: browserOptions && !isNull(browserOptions.format) ? browserOptions.format : (browserFormat || "umd"),
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
    extend: normalizeBuildFlag(browserOptions, "extend", !!extend),
  };

  const binaryOutput: CommonJSBuildOptions | null = (
    binaryOptions === false || !pkgBin
  )
    ? null : {
      path: resolve(cwd, pkgBin as string),
      sourcemap: normalizeBuildSourcemap(
        binaryOptions,
        globalSourcemap,
      ),
      esModule: normalizeBuildModule(binaryOptions, "esModule", "bin", globalESModule),
      interop: normalizeBuildModule(binaryOptions, "interop", "bin", globalInterop),
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
