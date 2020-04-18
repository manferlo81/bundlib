import { BuildType, ObjectBasedSelectiveOption, ObjectSelectiveOptions, SelectiveType } from '../bundlib-options';
import { invalidOption } from '../errors';
import { Nullable, TypeCheckFunction } from '../helper-types';
import { keys, keysToObject } from '../tools/helpers';
import { composeOneOf, createOneOfLiteral } from '../type-check/advanced';
import { isNull, isObject } from '../type-check/basic';
import { keysCheck } from '../type-check/keys';

export type SelectiveResolved<K extends string, T> = Record<K, T>;

export const API_BUILD_KEYS: ['main', 'module', 'browser'] = ['main', 'module', 'browser'];
export const MODULE_BUILD_KEYS = [...API_BUILD_KEYS, 'bin'] as ['main', 'module', 'browser', 'bin'];
export const ALL_BUILD_KEYS = [...MODULE_BUILD_KEYS, 'types'] as ['main', 'module', 'browser', 'bin', 'types'];

export const isBuildType = createOneOfLiteral<BuildType>(
  'main',
  'module',
  'browser',
  'bin',
);

export const isBuildTypeString = composeOneOf<SelectiveType<BuildType>>(
  'api',
  isBuildType,
);

export const isSelectiveObjectKey = composeOneOf<'default' | SelectiveType<BuildType>>(
  'default',
  isBuildTypeString,
);

export function resolveObjectSelectiveOption<K extends BuildType, T, D>(
  value: ObjectSelectiveOptions<SelectiveType<K>, T>,
  defaultValue: D,
  allkeys: K[],
  isObjectKey: TypeCheckFunction<K | 'api' | 'default'>,
  isValidValue: TypeCheckFunction<T>,
  invalid: TypeError
): SelectiveResolved<K, T | D>;

export function resolveObjectSelectiveOption<T, D>(
  value: ObjectSelectiveOptions<SelectiveType<string>, T>,
  defaultValue: D,
  allkeys: string[],
  isObjectKey: TypeCheckFunction<string>,
  isValidValue: TypeCheckFunction<T>,
  invalid: TypeError
): SelectiveResolved<string, T | D>;

export function resolveObjectSelectiveOption<K extends BuildType, T, D>(
  value: ObjectSelectiveOptions<SelectiveType<K>, T>,
  defaultValue: D,
  allkeys: K[],
  isObjectKey: TypeCheckFunction<K | 'api' | 'default'>,
  isValidValue: TypeCheckFunction<T>,
  invalid: TypeError,
): SelectiveResolved<K, T | D> {

  if (!keysCheck(value, isObjectKey)) {
    throw invalid;
  }

  const { default: override, api, ...others } = value;

  if (!isNull(override) && !isValidValue(override)) {
    throw invalid;
  }

  const result = keysToObject<BuildType, T | D>(
    allkeys,
    isNull(override) ? defaultValue : override,
  );

  if (!isNull(api)) {

    if (!isValidValue(api)) {
      throw invalid;
    }

    keysToObject(
      API_BUILD_KEYS,
      api as T | D,
      result,
    );

  }

  keys(others).forEach((type) => {

    const value = others[type as never] as Nullable<T | D>;

    if (!isNull(value)) {

      if (!isValidValue(value)) {
        throw invalid;
      }

      result[type] = value;

    }

  });

  return result;

}

export function resolveObjectBasedSelectiveOption<T, D>(
  value: ObjectBasedSelectiveOption<BuildType, T>,
  defaultValue: D,
  allkeys: BuildType[],
  isValidValue: TypeCheckFunction<T>,
  optionName: string,
  url: string,
): SelectiveResolved<BuildType, T | D> {

  if (isNull(value)) {
    return keysToObject(
      allkeys,
      defaultValue,
    );
  }

  if (isValidValue(value)) {
    return keysToObject(
      allkeys,
      value,
    );
  }

  const invalid = invalidOption(optionName, url);

  if (!isObject(value)) {
    throw invalid;
  }

  return resolveObjectSelectiveOption<BuildType, T, D>(
    value,
    defaultValue,
    allkeys,
    isSelectiveObjectKey,
    isValidValue,
    invalid,
  );

}
