import builtinModules from "builtin-modules";
// import { resolve as resolvePath } from "path";
import readPkg from "read-pkg";
import resolvePath from "./resolve";

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
import { validateBrowserFormat } from "./val-format";
import { isValidMin } from "./val-min";

const analizePkg = async (cwd: string, pkg?: BundlibPkgJson): Promise<AnalizedPkg> => {

  pkg = pkg || await readPkg({ cwd }) as BundlibPkgJson;

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
  } = pkg;

  if (browserFile && !isString(browserFile)) {
    throw new TypeError("invalid package.json browser field.");
  }

  if (!isNull(bundlibOptions) && (!isObject(bundlibOptions) || isArray(bundlibOptions))) {
    throw new TypeError("invalid package.json bundlib field.");
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
    throw new TypeError("Invalid input options.");
  }

  if (!isNull(pkgBrowserFormat) && !isString(pkgBrowserFormat)) {
    throw new TypeError("invalid browser option.");
  }

  if (!isNull(browserName) && !isString(browserName)) {
    throw new TypeError("invalid name option.");
  }

  if (!isNull(id) && !isString(id)) {
    throw new TypeError("invalid id option.");
  }

  if (!isNull(browserGlobals) && !isObject(browserGlobals)) {
    throw new TypeError("invalid globals option.");
  }

  if (!isNull(min) && (!isString(min) && !isArray(min) && min !== true && min !== false)) {
    throw new TypeError("invalid min option.");
  }

  // compatible with version <0.3

  if ((iife && amd) || (iife && umd) || (amd && umd)) {
    throw new Error("multiple browser builds are no longer supported in bundlib >= 0.3.");
  }

  if (iife || amd || umd) {

    // warn about deprecated options

    // tslint:disable-next-line: no-console
    console.log("options iife, amd & umd are deprecated in version >= 0.3");
  }

  // get format from deprecated options if no format specified

  const browserFormat = validateBrowserFormat(pkgBrowserFormat || (iife ? "iife" : amd ? "amd" : "umd")) || "umd";

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
      ? browserGlobals.reduce<Record<string, string>>((r, v) => {
        if (isString(v)) {
          r[v] = v;
        }
        return r;
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
    esModule,
    interop,
    extend,
    equals,
  };

  return { cwd, pkg, dependencies, input, output, minify, browser, options };

};

export default analizePkg;
