import camelCase from 'camelcase';
import { basename } from 'node:path';
import type { AllowNull, AllowNullish } from '../types/helper-types';

function normalizeName(name: string) {
  return camelCase(basename(name));
}

export function normalizeBuildName(
  nameOption: AllowNullish<string>,
  pkgName: AllowNullish<string>,
  cwd: string,
): AllowNull<string> {
  // Return name option if present
  if (nameOption) return nameOption;

  // Return unscope camelcased version of package.json "name" field if present and valid
  if (pkgName) {
    const camelPkgName = normalizeName(pkgName);
    if (camelPkgName) return camelPkgName;
  }

  // Infer name from CWD
  const camelFolderName = normalizeName(cwd);
  if (camelFolderName) return camelFolderName;

  // Return null otherwise
  return null;
}
