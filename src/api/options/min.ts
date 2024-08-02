import type { Resolved } from 'selective-option';
import { resolveBoolBasedSelectiveOption } from '../selective/bool-based';
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS } from '../selective/consts';
import { isBool } from '../type-check/basic';
import type { BuildType, SelectiveMinOption } from '../types/bundlib-options';

export function resolveMinOption(value: SelectiveMinOption): Resolved<BuildType, boolean> {
  return resolveBoolBasedSelectiveOption<BuildType, boolean>(
    value,
    MODULE_BUILD_KEYS,
    API_SPECIAL_KEYS,
    isBool,
    false,
    'min',
  );
}
