import type { Resolved } from 'selective-option';
import { resolveBoolBasedSelectiveOption } from '../selective/bool-based';
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS } from '../selective/consts';
import { composeOneOf, createOneOfLiteral } from '../type-check/advanced';
import { isBool } from '../type-check/basic';
import type { BuildType, SelectiveEsModuleOption } from '../types/bundlib-options';
import type { RollupEsModuleString } from '../types/rollup';

export const isEsModuleString = createOneOfLiteral('if-default-prop' as const);

export const isEsModuleOption = composeOneOf(
  isEsModuleString,
  isBool,
);

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
