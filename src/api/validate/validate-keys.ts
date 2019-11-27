import { keys } from '../helpers'
import { InList } from './in-list'

export function invalidKeys(object: Record<string, unknown>, list: string[]): string[] | null {
  const invalid = keys(object).filter(
    (key) => !list.includes(key),
  )
  return invalid.length ? invalid : null
}

export function keysInList<M extends string>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: Record<string, any>,
  inList: InList<M>,
): obj is Partial<Record<M, unknown>> {
  return keys(obj).every(inList)
}
