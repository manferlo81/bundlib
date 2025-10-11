import type { Resolved } from 'selective-option'
import { createBoolBasedResolver } from 'selective-option'
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS, OVERRIDE_KEY } from '../selective/constants'
import { resolveOptionOrThrow } from '../selective/resolve-or-throw'
import type { BuildType } from './types/build-type'
import type { SelectiveMinOption } from './types/bundlib'

const minOptionResolver = createBoolBasedResolver(
  MODULE_BUILD_KEYS,
  null,
  false,
  OVERRIDE_KEY,
  API_SPECIAL_KEYS,
)

export function resolveMinOption(value: SelectiveMinOption): Resolved<BuildType, boolean> {
  return resolveOptionOrThrow(
    minOptionResolver,
    value,
    'min',
  )
}
