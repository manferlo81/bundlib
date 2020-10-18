import { invalidOption } from '../errors';
import { keysToObject, setProp } from '../tools/helpers';
import { createOneOfLiteral } from '../type-check/advanced';
import { isArray, isNull, isObject } from '../type-check/basic';
import type { BuildType, SelectiveOption, SelectiveSkipBuildType, SelectiveType } from '../types/bundlib-options';
import type { TypeCheckFunction } from '../types/helper-types';
import { populateWithAPIValue, resolveObjectSelectiveOption } from './object-based';
import type { SelectiveResolved } from './object-based';
import { resolveTypeStringArray } from './string-based';

export type SelectiveResolvedBoolean<K extends string> = SelectiveResolved<K, boolean>;

export function resolveSelectiveOption<K extends BuildType, T, D>(
  value: SelectiveOption<SelectiveType<K>, T>,
  defaultValue: D,
  isValidValue: TypeCheckFunction<T>,
  allKeys: K[],
  optionName: string,
  urlHash?: string
): SelectiveResolved<K, boolean | T | D>;

export function resolveSelectiveOption<K extends SelectiveSkipBuildType, T, D>(
  value: SelectiveOption<SelectiveType<K>, T>,
  defaultValue: D,
  isValidValue: TypeCheckFunction<T>,
  allKeys: K[],
  optionName: string,
  urlHash?: string
): SelectiveResolved<K, boolean | T | D>;

export function resolveSelectiveOption<K extends string, T, D>(
  value: SelectiveOption<SelectiveType<K>, T>,
  defaultValue: D,
  isValidValue: TypeCheckFunction<T>,
  allKeys: K[],
  optionName: string,
  urlHash?: string
): SelectiveResolved<K, boolean | T | D>;

export function resolveSelectiveOption<K extends string, T, D>(
  value: SelectiveOption<SelectiveType<K>, T>,
  defaultValue: D,
  isValidValue: TypeCheckFunction<T>,
  allKeys: K[],
  optionName: string,
  urlHash?: string,
): SelectiveResolved<K, boolean | T | D> {

  if (isNull(value) || value === defaultValue) {
    return keysToObject(
      allKeys,
      defaultValue,
    );
  }

  if (isValidValue(value)) {
    return keysToObject(
      allKeys,
      value,
    );
  }

  if (value === 'api') {
    return populateWithAPIValue(
      true,
      keysToObject(allKeys, false),
    );
  }

  const isBuildType = createOneOfLiteral<K>(allKeys);

  if (isBuildType(value)) {
    return setProp(
      value,
      true,
      keysToObject(allKeys, false),
    );
  }

  const invalid = invalidOption(optionName, urlHash);

  if (!isObject(value)) {
    throw invalid;
  }

  if (isArray(value)) {
    return resolveTypeStringArray(
      value,
      isBuildType,
      allKeys,
      invalid,
    );
  }

  return resolveObjectSelectiveOption<K, T, D>(
    value,
    defaultValue,
    isValidValue,
    isBuildType,
    allKeys,
    invalid,
  );

}
