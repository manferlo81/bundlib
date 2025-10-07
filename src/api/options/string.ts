import type { Resolved } from 'selective-option'
import { createValueBasedResolver } from 'selective-option'
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS, OVERRIDE_KEY } from '../selective/constants'
import { resolveOptionOrThrow } from '../selective/resolve-or-throw'
import { isString } from '../type-check/basic'
import type { BuildType, SelectiveStringOption } from '../types/bundlib-options'
import type { AllowNull } from '../types/helper-types'

const stringOptionResolver = createValueBasedResolver(
  MODULE_BUILD_KEYS,
  isString,
  null,
  OVERRIDE_KEY,
  API_SPECIAL_KEYS,
)

export const resolveStringOption = (value: SelectiveStringOption, optionName: string): Resolved<BuildType, AllowNull<string>> => {
  return resolveOptionOrThrow(
    stringOptionResolver,
    value,
    optionName,
  )
}
