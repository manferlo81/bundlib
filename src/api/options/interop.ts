import type { Resolved } from 'selective-option'
import { createBoolBasedResolver } from 'selective-option'
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS, OVERRIDE_KEY } from '../selective/constants'
import { resolveOptionOrThrow } from '../selective/resolve-or-throw'
import { createOneOfLiteral } from '../type-check/advanced'
import type { BuildType } from './types/build-type'
import type { SelectiveInteropOption } from './types/bundlib'
import type { BundlibInteropOption, BundlibNonBooleanInteropOption } from './types/rollup'

export const isInteropString = createOneOfLiteral<BundlibNonBooleanInteropOption>(
  'auto',
  'compat',
  'esModule',
  'default',
  'defaultOnly',
)

const interopOptionResolver = createBoolBasedResolver(
  MODULE_BUILD_KEYS,
  isInteropString,
  false,
  OVERRIDE_KEY,
  API_SPECIAL_KEYS,
)

export function resolveInteropOption(value: SelectiveInteropOption): Resolved<BuildType, BundlibInteropOption> {
  return resolveOptionOrThrow(
    interopOptionResolver,
    value,
    'interop',
  )
}

export function normalizeRollupInterop(interopBool: BundlibInteropOption): BundlibNonBooleanInteropOption {
  if (interopBool === true) return 'compat'
  if (interopBool === false) return 'default'
  return interopBool
}
