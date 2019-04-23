import mod from "module";
import { extname, join, resolve as resolvePath } from "path";

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

    const ext = extname(types);

    if (ext !== ".ts") {
      types = join(types, "index.d.ts");
    }

  }

  const options2: BundlibPkgOptions = bundlib || {};

  let {
    input,
    sourcemap,
    esModule,
    interop,
    iife,
    amd,
    umd,
    name,
    id,
    extend,
    equals,
  } = options2;

  const { globals } = options2;

  input = resolvePath(cwd, input || "src/index.ts");
  sourcemap = sourcemap !== false;
  esModule = !!esModule;
  interop = !!interop;
  equals = !!equals;

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
    globals,
    equals,
  };

  return { cwd, pkg, external, types, options };
};

export default analizePkg;
