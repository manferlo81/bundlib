import { ModuleOption, ModuleString, WithModuleOptions } from '../bundlib-options';
import { Nullable } from '../helper-types';
import { keysToObject, setProp } from '../helpers';
import { isArray, isBool, isNull } from '../type-check/type-check';
import { createOneOf } from '../type-check/one-of';

export type ModuleGlobal = Record<ModuleString, boolean>;

export const isModuleString = createOneOf<ModuleString>(
  'main',
  'browser',
  'bin',
);

export function isModuleOption(value: unknown): value is ModuleOption {
  return isNull(value) || isBool(value) || isModuleString(value) || (
    isArray<unknown>(value) && value.every(isModuleString)
  );
}

export function normalizeModuleOption(option: ModuleOption): ModuleGlobal {
  const keys: ModuleString[] = ['main', 'browser', 'bin'];
  return !option ? keysToObject(keys, false)
    : option === true ? keysToObject(keys, true)
      : isArray(option) ? option.reduce((result, field) => setProp(field, true, result), keysToObject(keys, false))
        : setProp(option, true, keysToObject(keys, false));
}

export function normalizeBuildModule(
  build: Nullable<WithModuleOptions>,
  key: keyof WithModuleOptions,
  field: ModuleString,
  def: ModuleGlobal,
): boolean {
  return (!build || isNull(build[key])) ? def[field] : build[key] as boolean;
}
