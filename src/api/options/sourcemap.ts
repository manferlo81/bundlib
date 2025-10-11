import type { Resolved } from 'selective-option'
import { createBoolBasedResolver } from 'selective-option'
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS, OVERRIDE_KEY } from '../selective/constants'
import { resolveOptionOrThrow } from '../selective/resolve-or-throw'
import { createOneOfLiteral } from '../type-check/advanced'
import type { BuildType } from './types/build-type'
import type { SelectiveSourcemapOption } from './types/bundlib'
import type { BundlibNonBooleanSourcemapOption, BundlibSourcemapOption } from './types/rollup'

const isSourcemapString = createOneOfLiteral<BundlibNonBooleanSourcemapOption>(
  'inline',
  'hidden',
)

const sourcemapOptionResolver = createBoolBasedResolver(
  MODULE_BUILD_KEYS,
  isSourcemapString,
  true,
  OVERRIDE_KEY,
  API_SPECIAL_KEYS,
)

export function resolveSourcemapOption(value: SelectiveSourcemapOption): Resolved<BuildType, BundlibSourcemapOption> {
  return resolveOptionOrThrow(
    sourcemapOptionResolver,
    value,
    'sourcemap',
  )
}
