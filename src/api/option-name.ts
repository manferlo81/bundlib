import camelcase from "camelcase";
import { basename } from "path";
import { Nullable } from "./bundlib-options";

function normalizeBuildName(
  cwd: string,
  nameOption: Nullable<string>,
  pkgName: Nullable<string>,
): string | null {
  return nameOption || (
    pkgName && camelcase(basename(pkgName))
  ) || camelcase(basename(cwd)) || null;
}

export default normalizeBuildName;
