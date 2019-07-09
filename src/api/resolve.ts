import { resolve as pathResolve } from "path";
import { Nullable } from "./types";

function resolve(cwd: string, filepath: Nullable<"">): null;
function resolve(cwd: string, filepath: string): string;
function resolve(cwd: string, filepath: Nullable<string>): string | null;
function resolve(cwd: string, filepath: Nullable<string>): string | null {
  return filepath ? pathResolve(cwd, filepath) : null;
}

export default resolve;
