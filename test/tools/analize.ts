import { analizePkg, BundlibPkgJson } from "../../src/api";

const analize = (cwd: string, pkg?: BundlibPkgJson) => (
  pkg ? analizePkg(cwd, pkg) : analizePkg(cwd)
);

export default analize;
