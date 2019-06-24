import readPkg from "read-pkg";

import { extname } from "path";
import { BundlibOptions } from "./bundlib-options";
import { error, invalidOption, invalidPkgField } from "./errors";
import { PkgJsonPossibleTypes } from "./json-types";
import { BundlibPkgJson, PkgJsonModuleOutputFields } from "./pkg";
import { AnalizedPkg, BrowserOptions, Dependencies, MinifyOptions, OutputFiles, OutputOptions } from "./pkg-analized";
import resolve from "./resolve";
import { isArray, isBool, isNull, isObject, isString } from "./type-check";
import { isBrowserFormat } from "./validate-fmt";
import { isValidMinOption } from "./validate-min";

async function analizePkg(cwd: string, pkg?: BundlibPkgJson): Promise<AnalizedPkg> {

  const resolvedPkg: BundlibPkgJson = pkg || await readPkg({ cwd });

  const {
    name: pkgName,
    main: cjsModuleFile,
    module: esModuleFile,
    browser: browserFile,
    types: pkgTypes,
    typings,
    dependencies: runtimeDependencies,
    peerDependencies,
    bundlib: bundlibOptions,
  } = resolvedPkg;

  if (!isNull(browserFile) && !isString(browserFile)) {
    throw invalidPkgField("browser");
  }

  if (!isNull(bundlibOptions) && (!isObject(bundlibOptions) || isArray(bundlibOptions))) {
    throw invalidPkgField("bundlib");
  }

  // TODO: thorw on unknown options

  const {
    input: pkgInput,
    sourcemap: sourcemapOption,
    esModule: esModuleFlag,
    interop: interopFlag,
    extend: extendFlag,
    equals: equalsFlag,
    browser: browserFormat,
    name: browserName,
    id: amdId,
    globals: browserGlobals,
    iife,
    amd,
    umd,
    min,
  } = (bundlibOptions || {}) as BundlibOptions;

  if (!isNull(pkgInput) && !isString(pkgInput)) {
    throw invalidOption("input");
  }

  if (!isNull(sourcemapOption) && !isBool(sourcemapOption) && sourcemapOption !== "inline") {
    throw invalidOption("sourcemap");
  }

  if (!isNull(browserFormat) && !isBrowserFormat(browserFormat)) {
    throw invalidOption("browser");
  }

  if (!isNull(browserName) && !isString(browserName)) {
    throw invalidOption("name");
  }

  if (!isNull(amdId) && !isString(amdId)) {
    throw invalidOption("id");
  }

  if (!isNull(browserGlobals) && !isObject<PkgJsonPossibleTypes>(browserGlobals)) {
    throw invalidOption("globals");
  }

  if (!isNull(min) && !isValidMinOption(min)) {
    throw invalidOption("min");
  }

  if (iife || amd || umd) {
    throw error("options iife, amd & umd were removed in version 0.6");
  }

  if (pkgInput && extname(pkgInput) !== ".ts") {
    throw error("option input has to point to a typescript (.ts) file.");
  }

  const input = resolve(
    pkgInput || "src/index.ts",
    cwd,
  );

  const typesPath = pkgTypes || typings;

  const output: OutputFiles = {
    main: cjsModuleFile ? resolve(cjsModuleFile, cwd) : null,
    module: esModuleFile ? resolve(esModuleFile, cwd) : null,
    browser: browserFile ? resolve(browserFile, cwd) : null,
    types: typesPath ? resolve(typesPath, cwd) : null,
  };

  const dependencies: Dependencies = {
    runtime: runtimeDependencies ? Object.keys(runtimeDependencies) : [],
    peer: peerDependencies ? Object.keys(peerDependencies) : [],
  };

  const buildName = browserName || pkgName || null;

  const minify: MinifyOptions = !min
    ? {}
    : min as unknown as boolean === true
      ? { main: true, module: true, browser: true }
      : isArray(min)
        ? min.reduce((result, value) => {
          result[value] = true;
          return result;
        }, {} as MinifyOptions)
        : {
          [min as PkgJsonModuleOutputFields]: true,
        };

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

  const sourcemap = sourcemapOption === "inline" ? "inline" : (sourcemapOption !== false);

  const options: OutputOptions = {
    esModule: !!esModuleFlag,
    interop: !!interopFlag,
    extend: !!extendFlag,
    equals: !!equalsFlag,
  };

  return { cwd, pkg: resolvedPkg, input, output, sourcemap, dependencies, minify, browser, options };

}

export default analizePkg;
