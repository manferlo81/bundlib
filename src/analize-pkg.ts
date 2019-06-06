import builtinModules from "builtin-modules";
import readPkg from "read-pkg";
import resolvePath from "./resolve";

import { log } from "./console";
import { error, invalidOption, invalidPkgField } from "./errors";
import {
  AnalizedPkg,
  BrowserOptions,
  BundlibDependencies,
  BundlibOutputFiles,
  BundlibPkgJson,
  BundlibPkgOptions,
  MinifyOutOptions,
} from "./pkg";
import { isArray, isNull, isObject, isString } from "./type-check";
import { BrowserBuildFormat } from "./types";
import { validateBrowserFormat } from "./validate-fmt";
import { isValidMin } from "./validate-min";

const analizePkg = async (cwd: string, pkg?: BundlibPkgJson): Promise<AnalizedPkg> => {

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
    sourcemap,
    esModule,
    interop,
    extend,
    equals,
    browser: pkgBrowserFormat,
    name: browserName,
    id,
    globals: browserGlobals,
    iife,
    amd,
    umd,
    min,
  } = (bundlibOptions || {}) as BundlibPkgOptions;

  if (!isNull(pkgInput) && !isString(pkgInput)) {
    throw invalidOption("input");
  }

  if (!isNull(pkgBrowserFormat) && !isString(pkgBrowserFormat)) {
    throw invalidOption("browser");
  }

  if (!isNull(browserName) && !isString(browserName)) {
    throw invalidOption("name");
  }

  if (!isNull(id) && !isString(id)) {
    throw invalidOption("id");
  }

  if (!isNull(browserGlobals) && !isObject(browserGlobals)) {
    throw invalidOption("globals");
  }

  if (!isNull(min) && (!isString(min) && !isArray(min) && min !== true && min !== false)) {
    throw invalidOption("min");
  }

  // compatible with version <0.3

  if ((iife && amd) || (iife && umd) || (amd && umd)) {
    throw error("multiple browser builds are no longer supported in bundlib >= 0.3.");
  }

  if (iife || amd || umd) {
    // warn about deprecated options
    log(false, "options iife, amd & umd are deprecated in version >= 0.3");
  }

  const deprecatedBrowserFormat: BrowserBuildFormat | null = iife ? "iife" : amd ? "amd" : null;

  // get format from deprecated options if no format specified

  const browserFormat: BrowserBuildFormat = validateBrowserFormat(pkgBrowserFormat || deprecatedBrowserFormat, "umd");

  //

  const input = resolvePath(
    pkgInput || "src/index.ts",
    cwd,
  );

  const typesPath = pkgTypes || typings;

  const output: BundlibOutputFiles = {
    main: cjsModuleFile ? resolvePath(cjsModuleFile, cwd) : null,
    module: esModuleFile ? resolvePath(esModuleFile, cwd) : null,
    browser: browserFile ? resolvePath(browserFile, cwd) : null,
    types: typesPath ? resolvePath(typesPath, cwd) : null,
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
    : min === true
      ? { main: true, module: true, browser: true }
      : isArray(min)
        ? min.reduce((result, value) => {
          if (isValidMin(value)) {
            result[value] = true;
          }
          return result;
        }, {} as MinifyOutOptions)
        : isValidMin(min)
          ? {
            [min]: true,
          }
          : {};

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
    format: browserFormat,
    name: buildName,
    id: id || null,
    globals,
  };

  const options = {
    sourcemap: sourcemap !== false,
    esModule: !!esModule,
    interop: !!interop,
    extend: !!extend,
    equals: !!equals,
  };

  return { cwd, pkg: resolvedPkg, dependencies, input, output, minify, browser, options };

};

export default analizePkg;
