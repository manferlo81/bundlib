import type { Resolved } from 'selective-option'
import { createBoolBasedResolver } from 'selective-option'
import { API_SPECIAL_KEYS, OVERRIDE_KEY, SKIP_OPTION_KEYS } from '../selective/constants'
import { resolveOptionOrThrow } from '../selective/resolve-or-throw'
import type { SkippableBuildType } from './types/build-type'
import type { SelectiveSkipOption } from './types/bundlib'

const skipOptionResolver = createBoolBasedResolver(
  SKIP_OPTION_KEYS,
  null,
  false,
  OVERRIDE_KEY,
  API_SPECIAL_KEYS,
)

export function resolveSkipOption(value: SelectiveSkipOption): Resolved<SkippableBuildType, boolean> {
  return resolveOptionOrThrow(
    skipOptionResolver,
    value,
    'skip',
  )
}
