import { extname } from "path";
import readPkg from "read-pkg";

import { BundlibOptions } from "./bundlib-options";
import { error, invalidOption, invalidPkgField, unknownOption } from "./errors";
import { BundlibPkgJson, PkgJsonModuleOutputFields } from "./pkg";
import { AnalizedPkg, BrowserOptions, Dependencies, MinifyOptions, OutputFiles, OutputOptions } from "./pkg-analized";
import { getFirstRemovedOption } from "./removed-options";
import resolve from "./resolve";
import { isArray, isBool, isDictionary, isNull, isObject, isString } from "./type-check";
import { RollupSourcemap } from "./types";
import { isBrowserFormat } from "./validate-fmt";
import { isValidMinOption } from "./validate-min";
import { getFirstUnknownOption } from "./validate-options";

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

  if (!isNull(bundlibOptions) && !isDictionary(bundlibOptions)) {
    throw invalidPkgField("bundlib");
  }

  const firstRemovedOption = bundlibOptions && getFirstRemovedOption(bundlibOptions);
  if (firstRemovedOption) {
    throw error(`option ${firstRemovedOption.name} was removed in version ${firstRemovedOption.ver}`);
  }

  const firstUnknownOption = bundlibOptions && getFirstUnknownOption(bundlibOptions);
  if (firstUnknownOption) {
    throw unknownOption(firstUnknownOption);
  }

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

  if (!isNull(browserGlobals) && !isObject(browserGlobals)) {
    throw invalidOption("globals");
  }

  if (!isNull(min) && !isValidMinOption(min)) {
    throw invalidOption("min");
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

  const minify: MinifyOptions = {
    main: false,
    module: false,
    browser: false,
    ...min && (
      min === true
        ? { main: true, module: true, browser: true }
        : isArray(min)
          ? min.reduce((result, value) => {
            result[value] = true;
            return result;
          }, {} as Record<PkgJsonModuleOutputFields, true>)
          : { [min]: true }
    ),
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

  const sourcemap: RollupSourcemap = sourcemapOption === "inline"
    ? "inline"
    : (sourcemapOption !== false);

  const options: OutputOptions = {
    esModule: !!esModuleFlag,
    interop: !!interopFlag,
    extend: !!extendFlag,
    equals: !!equalsFlag,
  };

  return { cwd, pkg: resolvedPkg, input, output, sourcemap, dependencies, minify, browser, options };

}

export default analizePkg;
