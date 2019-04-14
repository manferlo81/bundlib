import mod from "module";
import { parse, resolve as resolvePath } from "path";

import getPkg from "./get-pkg";
import { BundlibBuildOptions, BundlibPkgOptions, Pkg } from "./pkg";
import { BundlibPkg } from "./types";

const analizePkg = async (cwd: string, pkg?: Pkg): Promise<BundlibPkg> => {

  pkg = pkg || await getPkg(cwd);

  const { dependencies, peerDependencies, types: pkgTypes, typings, bundlib } = pkg;

  const external: string[] = [...mod.builtinModules];
  if (dependencies) {
    external.push(...Object.keys(dependencies));
  }
  if (peerDependencies) {
    external.push(...Object.keys(peerDependencies));
  }

  let types: string | null = pkgTypes || typings || null;
  types = types && resolvePath(cwd, types);

  if (types) {

    const { dir, ext } = parse(types);

    // in case types points to folder/index.d.ts
    // set types to folder
    if (ext === ".ts") {
      types = dir;
    }

  }

  let { input, sourcemap, esModule, interop, iife, amd, umd, name, id, extend } = bundlib || {} as BundlibPkgOptions;

  input = resolvePath(cwd, input || "src/index.ts");
  sourcemap = sourcemap !== false;
  esModule = !!esModule;
  interop = !!interop;

  iife = iife || null;
  amd = amd || null;
  umd = umd || null;

  name = name || "";

  if ((iife || amd || umd) && !name) {
    throw new Error("name option is required for IIFE and UMD builds");
  }

  extend = !!extend;
  id = id || null;

  const options: BundlibBuildOptions = {
    input,
    sourcemap,
    esModule,
    interop,
    iife,
    amd,
    umd,
    name,
    extend,
    id,
  };

  return { cwd, pkg, external, types, options };
};

export default analizePkg;
