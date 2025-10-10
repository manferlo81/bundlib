import { keys } from '../tools/helpers'
import type { Dictionary, MaybeNull } from '../types/helper-types'
import type { TypeCheckFunction } from '../types/private-types'

interface InvalidKeyList extends Array<string> {
  0: string
  [K: number]: string
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function invalidKeys<K extends string>(object: Dictionary<unknown>, validKeys: K[]): MaybeNull<InvalidKeyList>
export function invalidKeys(object: Dictionary<unknown>, validKeys: string[]): MaybeNull<string[]> {
  const invalid = keys(object).filter(
    (key) => !validKeys.includes(key),
  )
  return invalid.length > 0 ? invalid : null
}

export function keysCheck<M extends string>(obj: Dictionary<unknown>, check: TypeCheckFunction<M>): obj is Record<M, unknown> {
  return keys(obj).every(check)
}
