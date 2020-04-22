import { BuildType, ObjectBasedSelectiveOption, ObjectSelectiveOptions, ObjectSelectiveOptionsKey, SelectiveSkipBuildType, SelectiveType } from '../bundlib-options';
import { invalidOption } from '../errors';
import { Nullable, TypeCheckFunction } from '../helper-types';
import { keys, keysToObject } from '../tools/helpers';
import { createOneOfLiteral } from '../type-check/advanced';
import { isNull, isObject } from '../type-check/basic';
import { keysCheck } from '../type-check/keys';

export type SelectiveResolved<K extends string, T> = Record<K, T>;

export const API_BUILD_KEYS: ['main', 'module', 'browser'] = ['main', 'module', 'browser'];
export const MODULE_BUILD_KEYS = [...API_BUILD_KEYS, 'bin'] as ['main', 'module', 'browser', 'bin'];
export const ALL_BUILD_KEYS = [...MODULE_BUILD_KEYS, 'types'] as ['main', 'module', 'browser', 'bin', 'types'];

export function populateWithAPIValue<T>(value: T, result: SelectiveResolved<string, T>): SelectiveResolved<string, T> {
  return keysToObject(
    API_BUILD_KEYS,
    value,
    result,
  );
}

export function resolveObjectSelectiveOption<K extends BuildType, T, D>(
  value: ObjectSelectiveOptions<SelectiveType<K>, T>,
  defaultValue: D,
  isValidValue: TypeCheckFunction<T>,
  isBuildType: TypeCheckFunction<K>,
  allkeys: K[],
  invalid: TypeError,
): SelectiveResolved<K, T | D>;

export function resolveObjectSelectiveOption<K extends SelectiveSkipBuildType, T, D>(
  value: ObjectSelectiveOptions<SelectiveType<K>, T>,
  defaultValue: D,
  isValidValue: TypeCheckFunction<T>,
  isBuildType: TypeCheckFunction<K>,
  allkeys: K[],
  invalid: TypeError,
): SelectiveResolved<K, T | D>;

export function resolveObjectSelectiveOption<K extends string, T, D>(
  value: ObjectSelectiveOptions<SelectiveType<K>, T>,
  defaultValue: D,
  isValidValue: TypeCheckFunction<T>,
  isBuildType: TypeCheckFunction<K>,
  allkeys: K[],
  invalid: TypeError,
): SelectiveResolved<K, T | D>;

export function resolveObjectSelectiveOption<K extends string, T, D>(
  value: ObjectSelectiveOptions<SelectiveType<K>, T>,
  defaultValue: D,
  isValidValue: TypeCheckFunction<T>,
  isBuildType: TypeCheckFunction<K>,
  allkeys: K[],
  invalid: TypeError,
): SelectiveResolved<K, T | D> {

  if (!keysCheck(value, createOneOfLiteral<ObjectSelectiveOptionsKey<K>>('default', 'api'), isBuildType)) {
    throw invalid;
  }

  const { default: override, api, ...others } = value;

  if (!isNull(override) && !isValidValue(override)) {
    throw invalid;
  }

  const result = keysToObject<string, T | D>(
    allkeys,
    isNull(override) ? defaultValue : override,
  );

  if (!isNull(api)) {

    if (!isValidValue(api)) {
      throw invalid;
    }

    populateWithAPIValue(
      api,
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
  isValidValue: TypeCheckFunction<T>,
  allkeys: BuildType[],
  optionName: string,
  urlHash?: string,
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

  const invalid = invalidOption(optionName, urlHash);

  if (!isObject(value)) {
    throw invalid;
  }

  return resolveObjectSelectiveOption<BuildType, T, D>(
    value,
    defaultValue,
    isValidValue,
    createOneOfLiteral(allkeys),
    allkeys,
    invalid,
  );

}
