import { resolve as pathResolve } from "path";

function resolve(filename: string, cwd: string) {
  return pathResolve(cwd, filename);
}

export default resolve;
