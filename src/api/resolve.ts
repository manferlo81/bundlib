import { resolve as pathResolve } from "path";

function resolve(cwd: string, path: "" | null | undefined): null;
function resolve(cwd: string, path: string): string;
function resolve(cwd: string, path: string | null | undefined): string | null;
function resolve(cwd: string, path: string | null | undefined): string | null {
  return path ? pathResolve(cwd, path) : null;
}

export default resolve;
