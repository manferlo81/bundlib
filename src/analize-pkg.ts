import builtinModules from "builtin-modules";
import readPkg from "read-pkg";

import { extname } from "path";
import { error, invalidOption, invalidPkgField } from "./errors";
import { PkgJsonPossibleTypes } from "./json-types";
import {
  AnalizedPkg,
  BrowserOptions,
  BundlibDependencies,
  BundlibOutputFiles,
  BundlibPkgJson,
  BundlibPkgOptions,
  MinifyOutOptions,
  PkgJsonModuleOutputFields,
} from "./pkg";
import resolve from "./resolve";
import { isArray, isNull, isObject, isString } from "./type-check";
import { BrowserBuildFormat } from "./types";
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
    bundledDependencies,
    bundleDependencies,
    bundlib: bundlibOptions,
  } = resolvedPkg;

  if (browserFile && !isString(browserFile)) {
    throw invalidPkgField("browser");
  }

  if (!isNull(bundlibOptions) && (!isObject(bundlibOptions) || isArray(bundlibOptions))) {
    throw invalidPkgField("bundlib");
  }

  const {
    input: pkgInput,
    sourcemap: sourcemapFlag,
    esModule: esModuleFlag,
    interop: interopFlag,
    extend: extendFlag,
    equals: equalsFlag,
    browser: pkgBrowserFormat,
    name: browserName,
    id: amdId,
    globals: browserGlobals,
    iife,
    amd,
    umd,
    min,
  } = (bundlibOptions || {}) as BundlibPkgOptions;

  if (!isNull(pkgInput) && !isString(pkgInput)) {
    throw invalidOption("input");
  }

  if (!isNull(pkgBrowserFormat) && !isBrowserFormat(pkgBrowserFormat)) {
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

  const output: BundlibOutputFiles = {
    main: cjsModuleFile ? resolve(cjsModuleFile, cwd) : null,
    module: esModuleFile ? resolve(esModuleFile, cwd) : null,
    browser: browserFile ? resolve(browserFile, cwd) : null,
    types: typesPath ? resolve(typesPath, cwd) : null,
  };

  const dependencies: BundlibDependencies = {
    builtin: builtinModules,
    runtime: runtimeDependencies ? Object.keys(runtimeDependencies) : [],
    peer: peerDependencies ? Object.keys(peerDependencies) : [],
    bundled: bundledDependencies || bundleDependencies || [],
  };

  const buildName = browserName || pkgName || null;

  const minify: MinifyOutOptions = !min
    ? {}
    : min as unknown as boolean === true
      ? { main: true, module: true, browser: true }
      : isArray(min)
        ? min.reduce((result, value) => {
          result[value] = true;
          return result;
        }, {} as MinifyOutOptions)
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

  const browserFormat: BrowserBuildFormat = pkgBrowserFormat || "umd";

  const browser: BrowserOptions = {
    format: browserFormat,
    name: buildName,
    id: amdId || null,
    globals,
  };

  const options = {
    sourcemap: sourcemapFlag !== false,
    esModule: !!esModuleFlag,
    interop: !!interopFlag,
    extend: !!extendFlag,
    equals: !!equalsFlag,
  };

  return { cwd, pkg: resolvedPkg, dependencies, input, output, minify, browser, options };

}

export default analizePkg;
