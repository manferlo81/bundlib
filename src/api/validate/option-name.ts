import camelcase from 'camelcase';
import { basename } from 'path';
import { Nullable, StrictNullable } from '../helper-types';

export function normalizeBuildName(
  cwd: string,
  browserName: Nullable<string>,
  nameOption: Nullable<string>,
  pkgName: Nullable<string>,
): StrictNullable<string> {
  return browserName || nameOption || (
    pkgName && camelcase(basename(pkgName))
  ) || camelcase(basename(cwd)) || null;
}
