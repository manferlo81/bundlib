import type { Resolved } from 'selective-option'
import { createBoolBasedResolver } from 'selective-option'
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS, OVERRIDE_KEY } from '../selective/constants'
import { resolveOptionOrThrow } from '../selective/resolve-or-throw'
import { createOneOfLiteral } from '../type-check/advanced'
import type { SelectiveSourcemapOption } from '../types/bundlib-options'
import type { BuildType } from '../types/options/build-type'
import type { RollupSupportedSourcemapOption, RollupSupportedSourcemapString } from '../types/rollup'

const isSourcemapString = createOneOfLiteral<RollupSupportedSourcemapString>(
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

export function resolveSourcemapOption(value: SelectiveSourcemapOption): Resolved<BuildType, RollupSupportedSourcemapOption> {
  return resolveOptionOrThrow(
    sourcemapOptionResolver,
    value,
    'sourcemap',
  )
}
