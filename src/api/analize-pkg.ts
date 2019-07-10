
import readPkg from "read-pkg";

import { BundlibOptions10 } from "./bundlib-options";
import { error, invalidOption, invalidPkgField } from "./errors";
import keysOrNull from "./keys-or-null";
import keys from "./obj-keys";
import { normalizeBuildFlag } from "./option-flag";
import { isBrowserFormat } from "./option-format";
import { isValidGlobals, normalizeGlobals } from "./option-globals";
import { isValidMinOption, normalizeBuildMin, normalizeMin } from "./option-min";
import normalizeBuildName from "./option-name";
import { normalizeBuildSourcemap, normalizeSourcemap } from "./options-sourcemap";
import { BundlibPkgJson } from "./pkg";
import {
  BinaryBuildInfo,
  BrowserBuildInfo,
  CommonJSBuildInfo,
  Dependencies,
  ESModuleBuildInfo,
  InputFiles,
  MinifyOptions,
  OutputFiles10,
  PkgAnalized10,
} from "./pkg-analized";
import resolve from "./resolve";
import { isBool, isDictionary, isDictionaryOrNull, isNull, isString, isStringOrNull } from "./type-check";
import { getInvalidOptions, invalidKeys } from "./validate-options";

async function analizePkg(cwd: string, pkg?: BundlibPkgJson): Promise<PkgAnalized10> {

  const resolvedPkg: BundlibPkgJson = pkg || await readPkg({ cwd, normalize: false });

  if (!isDictionary(resolvedPkg)) {
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
  } = resolvedPkg;

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

  const invalidOptions = bundlibOptions && getInvalidOptions(bundlibOptions);
  if (invalidOptions) {
    const optionNames = invalidOptions.map((name) => `"${name}"`).join(", ");
    throw error(`Unknown options found: (${optionNames})`);
  }

  const {
    input: pkgInput,
    sourcemap: sourcemapOption,
    esModule: esModuleFlag,
    interop: interopFlag,
    extend: extendFlag,
    equals: equalsFlag,
    format: browserFormat,
    name: browserName,
    id: amdId,
    globals: browserGlobals,
    min,
    cache: cacheOption,
    main: mainOptions10,
    module: moduleOptions10,
    browser: browserOptions10,
    bin: binaryOptions10,
    types: generateTypes10,
  } = bundlibOptions || {} as BundlibOptions10;

  if (
    !isNull(pkgInput) && !isString(pkgInput) && !(
      isDictionary(pkgInput) && !invalidKeys(pkgInput, ["api", "bin"]) && keys(pkgInput).every((key) => (
        isString(pkgInput[key])
      ))
    )
  ) {
    throw invalidOption("input", "string | { api?: string, bin?: string }");
  }

  if (!isNull(sourcemapOption) && !isBool(sourcemapOption) && sourcemapOption !== "inline") {
    throw invalidOption("sourcemap", 'boolean | "inline"');
  }

  if (!isNull(browserFormat) && !isBrowserFormat(browserFormat)) {
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
    !isNull(mainOptions10) && (mainOptions10 !== false) && !(
      isDictionary(mainOptions10) && !invalidKeys(mainOptions10, [
        "sourcemap",
        "esModule",
        "interop",
        "min",
        "equals",
      ])
    )
  ) {
    throw invalidOption("main", 'false | { sourcemap?: boolean | "inline", equals?, esModule?, interop?, min? }');
  }

  if (
    !isNull(moduleOptions10) && (moduleOptions10 !== false) && !(
      isDictionary(moduleOptions10) && !invalidKeys(moduleOptions10, [
        "sourcemap",
        "min",
      ])
    )
  ) {
    throw invalidOption("module", 'false | { sourcemap?: boolean | "inline", min? }');
  }

  if (
    !isNull(browserOptions10) && (browserOptions10 !== false) && !(
      isDictionary(browserOptions10) && !invalidKeys(browserOptions10, [
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
      isBrowserFormat(browserOptions10.format) &&
      (["name", "id"] as Array<keyof typeof browserOptions10>).every((key) => (
        isStringOrNull(browserOptions10[key])
      )),
      isValidGlobals(browserOptions10.globals)
    )
  ) {
    throw invalidOption("browser", 'false | { sourcemap?: boolean | "inline", esModule?, interop?, min? }');
  }

  if (
    !isNull(binaryOptions10) && !isString(binaryOptions10) && (binaryOptions10 !== false) && !(
      isDictionary(binaryOptions10) && !invalidKeys(binaryOptions10, [
        "sourcemap",
        "esModule",
        "interop",
        "min",
      ])
    )
  ) {
    throw invalidOption("bin", 'string | false | { sourcemap?: boolean | "inline", esModule?, interop?, min? }');
  }

  const esModuleFile = pkgModule || pkgJsNextMain;
  const typesPath = pkgTypes || typings;

  const apiInput = isStringOrNull(pkgInput) ? pkgInput : pkgInput.api;
  let binInput = isStringOrNull(pkgInput) ? null : pkgInput.bin;

  // falling back to "bin" option is "string" but this behavior will change in the future
  if (isString(binaryOptions10) && !binInput) {
    binInput = binaryOptions10;
  }

  const input: InputFiles = {
    api: resolve(cwd, apiInput || "src/index.ts"),
    bin: resolve(cwd, binInput || "src-bin/index.ts"),
  };

  const globalSourcemap = normalizeSourcemap(sourcemapOption);
  const globalMin: MinifyOptions = normalizeMin(min);

  const mainOutput: CommonJSBuildInfo | null = (mainOptions10 === false || !pkgMain) ? null : {
    file: resolve(cwd, pkgMain),
    sourcemap: normalizeBuildSourcemap(
      mainOptions10,
      globalSourcemap,
    ),
    esModule: normalizeBuildFlag(mainOptions10, "esModule", !!esModuleFlag),
    interop: normalizeBuildFlag(mainOptions10, "interop", !!interopFlag),
    equals: normalizeBuildFlag(mainOptions10, "equals", !!equalsFlag),
    min: normalizeBuildMin(mainOptions10, "main", globalMin),
  };

  const moduleOutput: ESModuleBuildInfo | null = (moduleOptions10 === false || !esModuleFile) ? null : {
    file: resolve(cwd, esModuleFile),
    sourcemap: normalizeBuildSourcemap(
      moduleOptions10,
      globalSourcemap,
    ),
    min: normalizeBuildMin(moduleOptions10, "module", globalMin),
  };

  const browserOutput: BrowserBuildInfo | null = (browserOptions10 === false || !pkgBrowser) ? null : {
    file: resolve(cwd, pkgBrowser),
    sourcemap: normalizeBuildSourcemap(
      browserOptions10,
      globalSourcemap,
    ),
    esModule: normalizeBuildFlag(browserOptions10, "esModule", !!esModuleFlag),
    interop: normalizeBuildFlag(browserOptions10, "interop", !!interopFlag),
    min: normalizeBuildMin(browserOptions10, "browser", globalMin),
    format: browserOptions10 && !isNull(browserOptions10.format) ? browserOptions10.format : (browserFormat || "umd"),
    name: normalizeBuildName(
      cwd,
      browserOptions10 ? browserOptions10.name : null,
      browserName,
      pkgName,
    ),
    id: amdId || null,
    globals: normalizeGlobals(browserGlobals),
    extend: normalizeBuildFlag(browserOptions10, "extend", !!extendFlag),
  };

  const binaryNormOptions10 = isString(binaryOptions10) ? null : binaryOptions10;

  const binaryOutput: BinaryBuildInfo | null = (
    binaryNormOptions10 === false || !pkgBin
  )
    ? null : {
      file: resolve(cwd, pkgBin),
      sourcemap: normalizeBuildSourcemap(
        binaryNormOptions10,
        globalSourcemap,
      ),
      esModule: normalizeBuildFlag(binaryNormOptions10, "esModule", !!esModuleFlag),
      interop: normalizeBuildFlag(binaryNormOptions10, "interop", !!interopFlag),
      min: normalizeBuildMin(binaryNormOptions10, "bin", globalMin),
    };

  const output10: OutputFiles10 = {
    main: mainOutput,
    module: moduleOutput,
    browser: browserOutput,
    bin: binaryOutput,
    types: (generateTypes10 === false) ? null : resolve(cwd, typesPath),
  };

  const dependencies: Dependencies = {
    runtime: keysOrNull(runtimeDependencies),
    peer: keysOrNull(peerDependencies),
    optional: keysOrNull(optionalDependencies),
  };

  const cache: string = resolve(cwd, cacheOption || "node_modules/.cache/bundlib");

  return {
    cwd,
    pkg: resolvedPkg,
    input,
    output: output10,
    dependencies,
    cache,
  };

}

export default analizePkg;
