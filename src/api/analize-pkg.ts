import { extname, resolve } from "path";
import readPkg from "read-pkg";

import { BundlibOptions } from "./bundlib-options";
import { error, invalidOption, invalidPkgField } from "./errors";
import { BundlibPkgJson } from "./pkg";
import {
  AnalizedPkg,
  BrowserOptions,
  Dependencies,
  InputFiles,
  MinifyOptions,
  ModuleOutputFields,
  OutputFiles,
  OutputOptions,
} from "./pkg-analized";
import { isArray, isBool, isDictionary, isNull, isObject, isString, isStringOrNull } from "./type-check";
import { RollupSourcemap } from "./types";
import { isBrowserFormat, isValidMinOption } from "./validate";
import getFirstUnknownOption from "./validate-options";

async function analizePkg(cwd: string, pkg?: BundlibPkgJson): Promise<AnalizedPkg> {

  const resolvedPkg = pkg || await readPkg({ cwd, normalize: false });

  if (!isDictionary(resolvedPkg)) {
    throw error("Invalid package.json content");
  }

  const {
    name: pkgName,
    main: cjsModuleFile,
    module: esModuleFile,
    browser: browserFile,
    bin: binFile,
    types: pkgTypes,
    typings,
    dependencies: runtimeDependencies,
    peerDependencies,
    bundlib: bundlibOptions,
  } = resolvedPkg;

  if (!isStringOrNull(browserFile)) {
    throw invalidPkgField("browser", "string");
  }

  if (!isStringOrNull(binFile)) {
    throw invalidPkgField("bin", "string");
  }

  if (!isNull(bundlibOptions) && !isDictionary(bundlibOptions)) {
    throw invalidPkgField("bundlib", "object");
  }

  const firstUnknownOption = bundlibOptions && getFirstUnknownOption(bundlibOptions);
  if (firstUnknownOption) {
    throw error(`Unknown option "${firstUnknownOption}"`);
  }

  const {
    input: pkgInput,
    bin: pkgBinInput,
    sourcemap: sourcemapOption,
    esModule: esModuleFlag,
    interop: interopFlag,
    extend: extendFlag,
    equals: equalsFlag,
    browser: browserFormat,
    name: browserName,
    id: amdId,
    globals: browserGlobals,
    min,
    cache: cacheOption,
  } = (bundlibOptions || {}) as BundlibOptions;

  if (!isStringOrNull(pkgInput)) {
    throw invalidOption("input");
  }

  if (!isStringOrNull(pkgBinInput)) {
    throw invalidOption("binInput");
  }

  if (!isNull(sourcemapOption) && !isBool(sourcemapOption) && sourcemapOption !== "inline") {
    throw invalidOption("sourcemap");
  }

  if (!isNull(browserFormat) && !isBrowserFormat(browserFormat)) {
    throw invalidOption("browser");
  }

  if (!isStringOrNull(browserName)) {
    throw invalidOption("name");
  }

  if (!isStringOrNull(amdId)) {
    throw invalidOption("id");
  }

  if (!isNull(browserGlobals) && !isObject(browserGlobals)) {
    throw invalidOption("globals");
  }

  if (!isNull(min) && !isValidMinOption(min)) {
    throw invalidOption("min");
  }

  if (!isStringOrNull(cacheOption)) {
    throw invalidOption("cache");
  }

  if (pkgInput && extname(pkgInput) !== ".ts") {
    throw error("option input has to point to a typescript (.ts) file.");
  }

  if (pkgBinInput && extname(pkgBinInput) !== ".ts") {
    throw error("option binInput has to point to a typescript (.ts) file.");
  }

  const input: InputFiles = {
    api: resolve(cwd, pkgInput || "src/index.ts"),
    bin: resolve(cwd, pkgBinInput || "src-bin/index.ts"),
  };

  const typesPath = pkgTypes || typings;

  const output: OutputFiles = {
    main: cjsModuleFile ? resolve(cwd, cjsModuleFile) : null,
    module: esModuleFile ? resolve(cwd, esModuleFile) : null,
    browser: browserFile ? resolve(cwd, browserFile) : null,
    bin: binFile ? resolve(cwd, binFile) : null,
    types: typesPath ? resolve(cwd, typesPath) : null,
  };

  const dependencies: Dependencies = {
    runtime: runtimeDependencies ? Object.keys(runtimeDependencies) : [],
    peer: peerDependencies ? Object.keys(peerDependencies) : [],
  };

  const buildName = browserName || pkgName || null;

  const minify: MinifyOptions = Object.assign(
    { main: false, module: false, browser: false },
    min && (
      min === true
        ? { main: true, module: true, browser: true }
        : isArray(min)
          ? min.reduce((result, value) => (result[value] = true, result), {} as Record<ModuleOutputFields, true>)
          : { [min]: true }
    ),
  );

  const globals = !browserGlobals
    ? null
    : isArray(browserGlobals)
      ? browserGlobals.reduce<Record<string, string>>((result, value) => {
        if (isString(value)) {
          result[value] = value;
        }
        return result;
      }, {})
      : browserGlobals as Record<string, string>;

  const browser: BrowserOptions = {
    format: browserFormat || "umd",
    name: buildName,
    id: amdId || null,
    globals,
  };

  const sourcemap: RollupSourcemap = sourcemapOption === "inline"
    ? "inline"
    : (sourcemapOption !== false);

  const cache = resolve(cwd, cacheOption || "node_modules/.cache");

  const options: OutputOptions = {
    esModule: !!esModuleFlag,
    interop: !!interopFlag,
    extend: !!extendFlag,
    equals: !!equalsFlag,
  };

  return { cwd, pkg: resolvedPkg, input, output, sourcemap, dependencies, minify, browser, options, cache };

}

export default analizePkg;
