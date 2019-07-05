import camelcase from "camelcase";
import { basename } from "path";

function normalizeBuildName(
  cwd: string,
  nameOption: string | null,
  pkgName: string | null | undefined,
): string | null {
  return nameOption || (
    pkgName && camelcase(basename(pkgName))
  ) || camelcase(basename(cwd)) || null;
}

export default normalizeBuildName;
