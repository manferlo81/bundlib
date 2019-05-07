import builtinModules from "builtin-modules";
import { resolve as resolvePath } from "path";
import readPkg from "read-pkg";

import {
  AnalizedPkg,
  BundlibBuildOptions,
  BundlibDependencies,
  BundlibOutputFiles,
  BundlibPkgOptions,
  Pkg,
} from "./pkg";

const analizePkg = async (cwd: string, pkg?: Pkg): Promise<AnalizedPkg> => {

  pkg = pkg || await readPkg({ cwd }) as Pkg;

  const {
    name: pkgName,
    main,
    module: esModuleFile,
    dependencies: runtimeDependencies,
    peerDependencies,
    bundledDependencies,
    bundleDependencies,
    types: pkgTypes,
    typings,
    bundlib: pkgBundlib,
  } = pkg;

  const {
    input: pkgInput,
    iife: iifeFile,
    amd: amdFile,
    umd: umdFile,
    sourcemap,
    esModule,
    interop,
    name,
    id,
    extend,
    globals,
    equals,
  } = pkgBundlib || {} as BundlibPkgOptions;

  const input = resolvePath(cwd, pkgInput || "src/index.ts");

  const typesPath = typings || pkgTypes;

  const output: BundlibOutputFiles = {
    cjs: main ? resolvePath(cwd, main) : null,
    es: esModuleFile ? resolvePath(cwd, esModuleFile) : null,
    iife: iifeFile ? resolvePath(cwd, iifeFile) : null,
    amd: amdFile ? resolvePath(cwd, amdFile) : null,
    umd: umdFile ? resolvePath(cwd, umdFile) : null,
    types: typesPath ? resolvePath(cwd, typesPath) : null,
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
    name: buildName,
    extend: !!extend,
    id: id || null,
    globals,
    equals: !!equals,
  };

  return { cwd, pkg, dependencies, input, output, options };

};

export default analizePkg;
