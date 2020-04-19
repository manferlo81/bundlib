import { BuildType, SelectiveOption, SelectiveSkipBuildType, SelectiveType } from '../bundlib-options';
import { invalidOption } from '../errors';
import { Nullable, TypeCheckFunction } from '../helper-types';
import { keysToObject } from '../tools/helpers';
import { composeOneOf } from '../type-check/advanced';
import { isArray, isNull, isObject } from '../type-check/basic';
import { resolveObjectSelectiveOption, SelectiveResolved } from './object-based';
import { resolveTypeString, resolveTypeStringArray } from './string-based';

export type SelectiveResolvedBoolean<K extends string> = SelectiveResolved<K, boolean>;

export function resolveSelectiveOption<K extends SelectiveSkipBuildType, T>(
  value: SelectiveOption<SelectiveType<K>, T>,
  defaultValue: T,
  isSelectiveTypeString: TypeCheckFunction<K>,
  isValidValue: TypeCheckFunction<T>,
  allkeys: K[],
  optionName: string,
  url: string
): SelectiveResolved<K, T>;

export function resolveSelectiveOption<K extends SelectiveSkipBuildType, T, D>(
  value: SelectiveOption<SelectiveType<K>, T>,
  defaultValue: D,
  isSelectiveTypeString: TypeCheckFunction<K>,
  isValidValue: TypeCheckFunction<T>,
  allkeys: K[],
  optionName: string,
  url: string
): SelectiveResolved<K, T | D>;

export function resolveSelectiveOption<K extends BuildType, T>(
  value: SelectiveOption<SelectiveType<K>, T>,
  defaultValue: T,
  isSelectiveTypeString: TypeCheckFunction<K>,
  isValidValue: TypeCheckFunction<T>,
  allkeys: K[],
  optionName: string,
  url: string
): SelectiveResolved<K, T>;

export function resolveSelectiveOption<K extends BuildType, T, D>(
  value: SelectiveOption<SelectiveType<K>, T>,
  defaultValue: D,
  isSelectiveTypeString: TypeCheckFunction<K>,
  isValidValue: TypeCheckFunction<T>,
  allkeys: K[],
  optionName: string,
  url: string
): SelectiveResolved<K, T | D>;

export function resolveSelectiveOption<T extends boolean, D>(
  value: SelectiveOption<BuildType, T>,
  defaultValue: D,
  isSelectiveTypeString: TypeCheckFunction<BuildType>,
  isValidValue: TypeCheckFunction<T>,
  allkeys: BuildType[],
  optionName: string,
  url: string,
): SelectiveResolved<BuildType, T | D> {

  if (isNull(value) || value === defaultValue) {
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

  if (isSelectiveTypeString(value)) {
    return resolveTypeString(
      value,
      allkeys,
    ) as SelectiveResolved<BuildType, T>;
  }

  const invalid = invalidOption(optionName, url);

  if (!isObject(value)) {
    throw invalid;
  }

  if (isArray(value)) {
    return resolveTypeStringArray(
      value,
      isSelectiveTypeString,
      allkeys,
      invalid,
    ) as SelectiveResolved<BuildType, T>;
  }

  return resolveObjectSelectiveOption<BuildType, T, D>(
    value,
    defaultValue,
    allkeys,
    composeOneOf('default', isSelectiveTypeString),
    isValidValue,
    invalid,
  );

}

export function normalizeBooleanOption<K extends string>(
  build: Nullable<{ [X in K]?: Nullable<boolean> }>,
  key: K,
  def: boolean,
): boolean {

  if (!build) {
    return def;
  }

  const { [key]: value } = build;

  if (isNull(value)) {
    return def;
  }

  return !!value;

}
