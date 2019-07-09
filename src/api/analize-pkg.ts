import readPkg from "read-pkg";

import { BundlibOptions } from "./bundlib-options";
import { error, invalidOption, invalidPkgField } from "./errors";
import keysOrNull from "./keys-or-null";
import { isBrowserFormat } from "./option-format";
import { isValidGlobals, normalizeGlobals } from "./option-globals";
import { isValidMinOption, normalizeMin } from "./option-min";
import normalizeBuildName from "./option-name";
import { BundlibPkgJson } from "./pkg";
import {
  AnalizedPkg,
  BrowserOptions,
  Dependencies,
  InputFiles,
  MinifyOptions,
  OutputFiles,
  OutputOptions,
} from "./pkg-analized";
import resolve from "./resolve";
import { isBool, isDictionary, isDictionaryOrNull, isNull, isStringOrNull } from "./type-check";
import { RollupSourcemap } from "./types";
import getInvalidOptions from "./validate-options";

async function analizePkg(cwd: string, pkg?: BundlibPkgJson): Promise<AnalizedPkg> {

  const resolvedPkg: BundlibPkgJson = pkg || await readPkg({ cwd, normalize: false });

  if (!isDictionary(resolvedPkg)) {
    throw error("Invalid package.json content");
  }

  const {
    name: pkgName,
    main: cjsModuleFile,
    module: esModuleStFile,
    "jsnext:main": esModuleFbFile,
    browser: browserFile,
    bin: binFile,
    types: pkgTypes,
    typings,
    dependencies: runtimeDependencies,
    peerDependencies,
    optionalDependencies,
    bundlib: bundlibOptions,
  } = resolvedPkg;

  if (!isStringOrNull(cjsModuleFile)) {
    throw invalidPkgField("main", "string");
  }

  if (!isStringOrNull(esModuleStFile)) {
    throw invalidPkgField("module", "string");
  }

  if (!isStringOrNull(esModuleFbFile) && !esModuleStFile) {
    throw invalidPkgField("jsnext:main", "string");
  }

  if (!isStringOrNull(browserFile)) {
    throw invalidPkgField("browser", "string");
  }

  if (!isStringOrNull(binFile)) {
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
  if (invalidOptions && invalidOptions.length) {
    const optionNames = invalidOptions.map((name) => `"${name}"`).join(", ");
    throw error(`Unknown options found: (${optionNames})`);
  }

  const {
    input: pkgInput,
    bin: pkgBinInput,
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
  } = bundlibOptions || {} as BundlibOptions;

  if (!isStringOrNull(pkgInput)) {
    throw invalidOption("input", "string");
  }

  if (!isStringOrNull(pkgBinInput)) {
    throw invalidOption("bin", "string");
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

  const input: InputFiles = {
    api: resolve(cwd, pkgInput || "src/index.ts"),
    bin: resolve(cwd, pkgBinInput || "src-bin/index.ts"),
  };

  const esModuleFile = esModuleStFile || esModuleFbFile;
  const typesPath = pkgTypes || typings;

  const output: OutputFiles = {
    main: resolve(cwd, cjsModuleFile),
    module: resolve(cwd, esModuleFile),
    browser: resolve(cwd, browserFile),
    bin: resolve(cwd, binFile),
    types: resolve(cwd, typesPath),
  };

  const dependencies: Dependencies = {
    runtime: keysOrNull(runtimeDependencies),
    peer: keysOrNull(peerDependencies),
    optional: keysOrNull(optionalDependencies),
  };

  const minify: MinifyOptions = normalizeMin(min);

  const buildName = normalizeBuildName(cwd, browserName, pkgName);
  const globals = normalizeGlobals(browserGlobals);

  const browser: BrowserOptions = {
    format: browserFormat || "umd",
    name: buildName,
    id: amdId || null,
    globals,
  };

  const sourcemap: RollupSourcemap = sourcemapOption === "inline"
    ? "inline"
    : (sourcemapOption !== false);

  const cache: string = resolve(cwd, cacheOption || "node_modules/.cache/bundlib");

  const options: OutputOptions = {
    esModule: !!esModuleFlag,
    interop: !!interopFlag,
    extend: !!extendFlag,
    equals: !!equalsFlag,
  };

  return { cwd, pkg: resolvedPkg, input, output, sourcemap, dependencies, minify, browser, options, cache };

}

export default analizePkg;
