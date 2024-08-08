import type { Resolved } from 'selective-option';
import { createBoolBasedResolver } from 'selective-option';
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS, OVERRIDE_KEY } from '../selective/constants';
import { resolveOptionOrThrow } from '../selective/resolve-or-throw';
import type { BuildType, SelectiveEsModuleOption } from '../types/bundlib-options';
import type { TypeCheckFunction } from '../types/helper-types';
import type { RollupEsModuleString } from '../types/rollup';

const isEsModuleString: TypeCheckFunction<RollupEsModuleString> = (value) => {
  return value === 'if-default-prop';
};

const esModuleOptionResolver = createBoolBasedResolver(
  MODULE_BUILD_KEYS,
  isEsModuleString,
  false,
  OVERRIDE_KEY,
  API_SPECIAL_KEYS,
);

export function resolveESModuleOption(value: SelectiveEsModuleOption): Resolved<BuildType, RollupEsModuleString | boolean> {
  return resolveOptionOrThrow(
    esModuleOptionResolver,
    value,
    'esModule',
  );
}
