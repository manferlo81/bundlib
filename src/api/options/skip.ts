import type { Resolved } from 'selective-option'
import { createBoolBasedResolver } from 'selective-option'
import { API_SPECIAL_KEYS, OVERRIDE_KEY, SKIP_OPTION_KEYS } from '../selective/constants'
import { resolveOptionOrThrow } from '../selective/resolve-or-throw'
import type { SelectiveSkipKey, SelectiveSkipOption } from '../types/bundlib-options'

const skipOptionResolver = createBoolBasedResolver(
  SKIP_OPTION_KEYS,
  null,
  false,
  OVERRIDE_KEY,
  API_SPECIAL_KEYS,
)

export function resolveSkipOption(value: SelectiveSkipOption): Resolved<SelectiveSkipKey, boolean> {
  return resolveOptionOrThrow(
    skipOptionResolver,
    value,
    'skip',
  )
}
