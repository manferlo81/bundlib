import type { Resolved } from 'selective-option';
import { createBoolBasedResolver } from 'selective-option';
import { ALL_BUILD_KEYS, API_SPECIAL_KEYS, OVERRIDE_KEY } from '../selective/constants';
import { resolveOptionOrThrow } from '../selective/resolve-or-throw';
import type { SelectiveSkipBuildType, SelectiveSkipOption } from '../types/bundlib-options';

const skipOptionResolver = createBoolBasedResolver(
  ALL_BUILD_KEYS,
  null,
  false,
  OVERRIDE_KEY,
  API_SPECIAL_KEYS,
);

export function resolveSkipOption(value: SelectiveSkipOption): Resolved<SelectiveSkipBuildType, boolean> {
  return resolveOptionOrThrow(
    skipOptionResolver,
    value,
    'skip',
  );
}
