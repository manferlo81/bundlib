import readPkg from "read-pkg";

import { BundlibOptions } from "./bundlib-options";
import depNames from "./dep-names";
import { error, invalidOption, invalidPkgField } from "./errors";
import normalizeBuildName from "./norm-build-name";
import normalizeGlobals from "./norm-globals";
import normalizeMinOption from "./norm-min";
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
import { isBool, isDictionary, isNull, isObject, isStringOrNull } from "./type-check";
import { RollupSourcemap } from "./types";
import { isBrowserFormat, isValidMinOption } from "./validate";
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

  if (!isStringOrNull(browserFile)) {
    throw invalidPkgField("browser", "string");
  }

  if (!isStringOrNull(binFile)) {
    throw invalidPkgField("bin", "string");
  }

  if (!isNull(bundlibOptions) && !isDictionary(bundlibOptions)) {
    throw invalidPkgField("bundlib", "Object");
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
    browser: browserDeprecatedFormat,
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

  if (!isNull(browserDeprecatedFormat) && !isBrowserFormat(browserDeprecatedFormat)) {
    throw invalidOption("browser", '"amd" | "iife" | "amd"');
  }

  if (!isStringOrNull(browserName)) {
    throw invalidOption("name", "string");
  }

  if (!isStringOrNull(amdId)) {
    throw invalidOption("id", "string");
  }

  if (!isNull(browserGlobals) && !isObject(browserGlobals)) {
    throw invalidOption("globals", "Object<string, string> | string[]");
  }

  if (!isNull(min) && !isValidMinOption(min)) {
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
    runtime: depNames(runtimeDependencies),
    peer: depNames(peerDependencies),
    optional: depNames(optionalDependencies),
  };

  const minify: MinifyOptions = normalizeMinOption(min);

  const buildName = normalizeBuildName(cwd, browserName, pkgName);
  const globals = normalizeGlobals(browserGlobals);

  const browser: BrowserOptions = {
    format: browserFormat || browserDeprecatedFormat || "umd",
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
