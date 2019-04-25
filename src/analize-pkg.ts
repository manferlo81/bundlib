import mod from "module";
import { resolve as resolvePath } from "path";

import { BundlibDependencies, BundlibPkg, BundlibPkgOutput } from "./bundlib-pkg";
import getPkg from "./get-pkg";
import { BundlibOutputOptions, BundlibPkgOptions, Pkg } from "./npm-pkg";

const analizePkg = async (cwd: string, pkg?: Pkg): Promise<BundlibPkg> => {

  pkg = pkg || await getPkg(cwd);

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
    bundlib,
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
  } = bundlib || {} as BundlibPkgOptions;

  const input = resolvePath(cwd, pkgInput || "src/index.ts");

  const types2 = typings || pkgTypes;

  const output: BundlibPkgOutput = {
    cjs: main ? resolvePath(cwd, main) : null,
    es: esModuleFile ? resolvePath(cwd, esModuleFile) : null,
    iife: iifeFile ? resolvePath(cwd, iifeFile) : null,
    amd: amdFile ? resolvePath(cwd, amdFile) : null,
    umd: umdFile ? resolvePath(cwd, umdFile) : null,
    types: types2 ? resolvePath(cwd, types2) : null,
  };

  const dependencies: BundlibDependencies = {
    builtin: mod.builtinModules,
    runtime: runtimeDependencies ? Object.keys(runtimeDependencies) : [],
    peer: peerDependencies ? Object.keys(peerDependencies) : [],
    bundled: bundledDependencies || bundleDependencies || [],
  };

  const buildName = name || pkgName || null;

  const options: BundlibOutputOptions = {
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
