import camelCase from 'camelcase';
import { basename } from 'path';
import type { AllowNull, AllowNullish } from '../types/helper-types';

export function normalizeBuildName(
  nameOption: AllowNullish<string>,
  pkgName: AllowNullish<string>,
  cwd: string,
): AllowNull<string> {
  if (nameOption) return nameOption;
  if (pkgName) {
    const camelPkgName = camelCase(basename(pkgName));
    if (camelPkgName) return camelPkgName;
  }
  const camelFolderName = camelCase(basename(cwd));
  if (camelFolderName) return camelFolderName;
  return null;
}
