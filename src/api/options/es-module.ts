import type { Resolved } from 'selective-option';
import { resolveBoolBasedSelectiveOption } from '../selective/bool-based';
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS } from '../selective/consts';
import type { BuildType, SelectiveEsModuleOption } from '../types/bundlib-options';
import type { TypeCheckFunction } from '../types/helper-types';
import type { RollupEsModuleString } from '../types/rollup';

export const isEsModuleString: TypeCheckFunction<RollupEsModuleString> = (value) => {
  return value === 'if-default-prop';
};

export function resolveESModuleOption(value: SelectiveEsModuleOption): Resolved<BuildType, RollupEsModuleString | boolean> {
  return resolveBoolBasedSelectiveOption(
    value,
    MODULE_BUILD_KEYS,
    API_SPECIAL_KEYS,
    isEsModuleString,
    false as boolean,
    'esModule',
    'esmodule',
  );
}
