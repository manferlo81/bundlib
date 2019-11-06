import camelcase from 'camelcase'
import { basename } from 'path'
import { Nullable } from './helper-types'

function normalizeBuildName(
  cwd: string,
  browserName: Nullable<string>,
  nameOption: Nullable<string>,
  pkgName: Nullable<string>,
): string | null {
  return browserName || nameOption || (
    pkgName && camelcase(basename(pkgName))
  ) || camelcase(basename(cwd)) || null
}

export default normalizeBuildName
