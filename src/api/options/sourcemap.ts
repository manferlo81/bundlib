import type { Resolved } from 'selective-option';
import { createBoolBasedResolver } from 'selective-option';
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS, OVERRIDE_KEY } from '../selective/constants';
import { resolveOptionOrThrow } from '../selective/resolve-or-throw';
import { createOneOfLiteral } from '../type-check/advanced';
import type { BuildType, SelectiveSourcemapOption } from '../types/bundlib-options';
import type { RollupSourcemap, RollupSourcemapString } from '../types/rollup';

const isSourcemapString = createOneOfLiteral<RollupSourcemapString>(
  'inline',
  'hidden',
);

const sourcemapOptionResolver = createBoolBasedResolver(
  MODULE_BUILD_KEYS,
  isSourcemapString,
  true,
  OVERRIDE_KEY,
  API_SPECIAL_KEYS,
);

export function resolveSourcemapOption(value: SelectiveSourcemapOption): Resolved<BuildType, RollupSourcemap> {
  return resolveOptionOrThrow(
    sourcemapOptionResolver,
    value,
    'sourcemap',
  );
}
