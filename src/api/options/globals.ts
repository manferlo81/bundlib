import { keys } from '../tools/helpers'
import { isNullish, isObject, isString } from '../type-check/basic'
import { isArray } from '../type-check/is-array'
import type { MaybeNull } from '../types/helper-types'
import type { GlobalsOption } from './types/bundlib'

export function isValidGlobals(value: unknown): value is GlobalsOption {

  // return true if value is nullish
  if (isNullish(value)) return true

  // return false if value is not an object or an array
  if (!isObject(value)) return false

  // if value is an array return whether or not every item is a string
  if (isArray(value)) return value.every(isString)

  // if value is an object return whether or not every value is a string
  return keys(value).every((key) => {
    return isString(key) && isString(value[key])
  })

}

export function normalizeGlobals(globals: GlobalsOption): MaybeNull<Record<string, string>> {

  // return null if option is nullish
  if (!globals) return null

  // return option if it's an object
  if (!isArray(globals)) return globals

  // return object from array
  return globals.reduce<Record<string, string>>((result, value) => {
    return { ...result, [value]: value }
  }, {})

}
