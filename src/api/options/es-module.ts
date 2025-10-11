import type { Resolved } from 'selective-option'
import { createBoolBasedResolver } from 'selective-option'
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS, OVERRIDE_KEY } from '../selective/constants'
import { resolveOptionOrThrow } from '../selective/resolve-or-throw'
import type { TypeCheckFunction } from '../types/private-types'
import type { BuildType } from './types/build-type'
import type { SelectiveEsModuleOption } from './types/bundlib'
import type { BundlibNonBooleanESModuleOption } from './types/rollup'

const isEsModuleString: TypeCheckFunction<BundlibNonBooleanESModuleOption> = (value) => {
  return value === 'if-default-prop'
}

const esModuleOptionResolver = createBoolBasedResolver(
  MODULE_BUILD_KEYS,
  isEsModuleString,
  false,
  OVERRIDE_KEY,
  API_SPECIAL_KEYS,
)

export function resolveESModuleOption(value: SelectiveEsModuleOption): Resolved<BuildType, BundlibNonBooleanESModuleOption | boolean> {
  return resolveOptionOrThrow(
    esModuleOptionResolver,
    value,
    'esModule',
  )
}
