import type { Resolved } from 'selective-option';
import { resolveBoolBasedSelectiveOption } from '../selective/bool-based';
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS } from '../selective/consts';
import type { BuildType, SelectiveEsModule } from '../types/bundlib-options';
import { composeOneOf, createOneOfLiteral } from '../type-check/advanced';
import { RollupEsModuleString } from '../types/rollup';
import { isBool } from '../type-check/basic';

export const isEsModuleString = createOneOfLiteral('if-default-prop' as const);

export const isEsModuleOption = composeOneOf(
  isEsModuleString,
  isBool,
);

export function resolveESModuleOption(value: SelectiveEsModule): Resolved<BuildType, RollupEsModuleString | boolean> {
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
