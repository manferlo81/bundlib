import type { OmitStrict, UnknownArray } from '../types/helper-types'

type ArrayIsArrayFunction = (value: unknown) => value is UnknownArray

interface ExtendedArrayConstructor extends OmitStrict<ArrayConstructor, 'isArray'> {
  isArray: ArrayIsArrayFunction
}

export const { isArray } = Array as ExtendedArrayConstructor
