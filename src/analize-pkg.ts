import builtinModules from "builtin-modules";
// import { resolve as resolvePath } from "path";
import readPkg from "read-pkg";
import resolvePath from "./resolve";

import {
  AnalizedPkg,
  BundlibBuildOptions,
  BundlibDependencies,
  BundlibOutputFiles,
  BundlibPkgJson,
  BundlibPkgOptions,
} from "./pkg";

const analizePkg = async (cwd: string, pkg?: BundlibPkgJson): Promise<AnalizedPkg> => {

  pkg = pkg || await readPkg({ cwd }) as BundlibPkgJson;

  const {
    name: pkgName,
    main,
    module: esModuleFile,
    browser: browserFile,
    dependencies: runtimeDependencies,
    peerDependencies,
    bundledDependencies,
    bundleDependencies,
    types: pkgTypes,
    typings,
    bundlib: pkgBundlib,
  } = pkg;

  if (browserFile && typeof browserFile !== "string") {
    throw new Error("invalid package.json browser field.");
  }

  const {
    input: pkgInput,
    sourcemap,
    esModule,
    interop,
    browser: pkgBrowserFormat,
    name,
    id,
    extend,
    globals,
    equals,
    iife,
    amd,
    umd,
  } = pkgBundlib || {} as BundlibPkgOptions;

  // compatible with version lower than 0.3

  if ((iife && amd) || (iife && umd) || (amd && umd)) {
    throw new Error("multiple browser builds are no longer supported in bundlib >= 0.3.");
  }

  if (iife || amd || umd) {

    // warn about deprecated options

    // tslint:disable-next-line: no-console
    console.log("options iife, amd & umd are deprecated in version >= 0.3");
  }

  // get format from deprecated options if no format specified

  const browserFormat = pkgBrowserFormat || (iife ? "iife" : amd ? "amd" : "umd");

  //

  const input = resolvePath(pkgInput || "src/index.ts", cwd);

  const typesPath = typings || pkgTypes;

  const output: BundlibOutputFiles = {
    cjs: main ? resolvePath(main, cwd) : null,
    es: esModuleFile ? resolvePath(esModuleFile, cwd) : null,
    browser: browserFile ? resolvePath(browserFile, cwd) : null,
    types: typesPath ? resolvePath(typesPath, cwd) : null,
  };

  const dependencies: BundlibDependencies = {
    builtin: builtinModules,
    runtime: runtimeDependencies ? Object.keys(runtimeDependencies) : [],
    peer: peerDependencies ? Object.keys(peerDependencies) : [],
    bundled: bundledDependencies || bundleDependencies || [],
  };

  const buildName = name || pkgName || null;

  const options: BundlibBuildOptions = {
    sourcemap: sourcemap !== false,
    esModule: !!esModule,
    interop: !!interop,
    browser: browserFormat,
    name: buildName,
    extend: !!extend,
    id: id || null,
    globals,
    equals: !!equals,
  };

  return { cwd, pkg, dependencies, input, output, options };

};

export default analizePkg;
