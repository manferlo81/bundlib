import { BuildType, MinOption, WithMinOption } from '../bundlib-options';
import { Nullable } from '../helper-types';
import { keysToObject, setProp } from '../helpers';
import { isArray, isBool, isNull } from '../type-check';
import { createInList } from './in-list';
import { isModuleString } from './option-esmodule';

export type MinGlobal = Record<BuildType, boolean>;

export const isMinString = createInList<BuildType>(
  isModuleString,
  'module',
);

export function isValidMinOption(value: unknown): value is MinOption {
  return isNull(value) || isBool(value) || isMinString(value) || (
    isArray<BuildType>(value) && value.every((item) => (
      isMinString(item)
    ))
  );
}

export function normalizeMinOption(min: MinOption): MinGlobal {
  const keys: BuildType[] = ['main', 'module', 'browser', 'bin'];
  return !min ? keysToObject(keys, false)
    : min === true ? keysToObject(keys, true)
      : isArray(min) ? min.reduce((result, field) => setProp(field, true, result), keysToObject(keys, false))
        : setProp(min, true, keysToObject(keys, false));
}

export function normalizeBuildMin(
  build: Nullable<WithMinOption>,
  field: BuildType,
  def: MinGlobal,
): boolean {
  return (!build || isNull(build.min)) ? def[field] : build.min;
}
