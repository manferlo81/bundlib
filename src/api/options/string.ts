import type { Resolved } from 'selective-option'
import { createValueBasedResolver } from 'selective-option'
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS, OVERRIDE_KEY } from '../selective/constants'
import { resolveOptionOrThrow } from '../selective/resolve-or-throw'
import { isString } from '../type-check/basic'
import type { SelectiveStringOption } from '../types/bundlib-options'
import type { MaybeNull } from '../types/helper-types'
import type { BuildType } from '../types/options/build-type'

const stringOptionResolver = createValueBasedResolver(
  MODULE_BUILD_KEYS,
  isString,
  null,
  OVERRIDE_KEY,
  API_SPECIAL_KEYS,
)

export const resolveStringOption = (value: SelectiveStringOption, optionName: string): Resolved<BuildType, MaybeNull<string>> => {
  return resolveOptionOrThrow(
    stringOptionResolver,
    value,
    optionName,
  )
}
