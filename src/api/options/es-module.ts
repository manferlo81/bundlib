import type { Resolved } from 'selective-option'
import { createBoolBasedResolver } from 'selective-option'
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS, OVERRIDE_KEY } from '../selective/constants'
import { resolveOptionOrThrow } from '../selective/resolve-or-throw'
import type { SelectiveEsModuleOption } from '../types/bundlib-options'
import type { BuildType } from '../types/options/build-type'
import type { TypeCheckFunction } from '../types/private-types'
import type { RollupSupportedESModuleString } from '../types/rollup'

const isEsModuleString: TypeCheckFunction<RollupSupportedESModuleString> = (value) => {
  return value === 'if-default-prop'
}

const esModuleOptionResolver = createBoolBasedResolver(
  MODULE_BUILD_KEYS,
  isEsModuleString,
  false,
  OVERRIDE_KEY,
  API_SPECIAL_KEYS,
)

export function resolveESModuleOption(value: SelectiveEsModuleOption): Resolved<BuildType, RollupSupportedESModuleString | boolean> {
  return resolveOptionOrThrow(
    esModuleOptionResolver,
    value,
    'esModule',
  )
}
