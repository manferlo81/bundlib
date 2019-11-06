import { Nullable } from './helper-types'
import { isNull } from './type-check'

export function normalizeBuildFlag<K extends string>(
  build: Nullable<Partial<Record<K, unknown>>>,
  key: K,
  def: boolean,
): boolean {
  return !build || isNull(build[key]) ? def : !!build[key]
}
