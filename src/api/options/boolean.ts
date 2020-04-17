import { BuildType, SelectiveBooleanOption, SelectiveOption, SelectiveSkipBuildType, SelectiveType } from '../bundlib-options';
import { invalidOption } from '../errors';
import { Nullable, TypeCheckFunction } from '../helper-types';
import { keys, keysToObject } from '../tools/helpers';
import { keysCheck } from '../type-check/keys';
import { createOneOf } from '../type-check/one-of';
import { isArray, isBool, isNull, isObject } from '../type-check/type-check';
import { API_KEYS, resolveTypeString, resolveTypeStringArray } from './selective';

export type BooleanBuildOptions<K extends string> = Record<K, boolean>;

export function resolveSelectiveBoolOption<K extends SelectiveSkipBuildType>(value: Nullable<SelectiveOption<SelectiveType<K>, boolean>>, defaultValue: boolean, check: TypeCheckFunction<K>, allkeys: K[], name: string, url: string): BooleanBuildOptions<K>;
export function resolveSelectiveBoolOption<K extends BuildType>(value: Nullable<SelectiveOption<SelectiveType<K>, boolean>>, defaultValue: boolean, check: TypeCheckFunction<K>, allkeys: K[], name: string, url: string): BooleanBuildOptions<K>;
export function resolveSelectiveBoolOption(value: Nullable<SelectiveBooleanOption>, defaultValue: boolean, check: TypeCheckFunction<string>, allkeys: string[], name: string, url: string): BooleanBuildOptions<string> {

  if (isNull(value) || value === defaultValue) {
    return keysToObject(
      allkeys,
      defaultValue,
    );
  }

  if (value === !defaultValue) {
    return keysToObject(
      allkeys,
      !defaultValue,
    );
  }

  if (check(value)) {
    return resolveTypeString(
      value,
      allkeys,
    );
  }

  const invalid = invalidOption(name, url);

  if (!isObject(value)) {
    throw invalid;
  }

  if (isArray(value)) {
    return resolveTypeStringArray(
      value,
      check,
      allkeys,
      invalid,
    );
  }

  if (!keysCheck(value, createOneOf('default', check))) {
    throw invalid;
  }

  const { default: override, api, ...others } = value;

  if (!isNull(override) && !isBool(override)) {
    throw invalid;
  }

  const result: BooleanBuildOptions<BuildType> = keysToObject(
    allkeys,
    isNull(override) ? defaultValue : override,
  );

  if (!isNull(api)) {
    if (!isBool(api)) {
      throw invalid;
    }
    keysToObject(
      API_KEYS,
      api,
      result,
    );
  }

  keys(others).forEach((type) => {
    const value = others[type];
    if (!isNull(value)) {
      if (!isBool(value)) {
        throw invalid;
      }
      result[type] = value;
    }
  });

  return result;

}

export function normalizeBooleanOption<K extends string>(
  build: Nullable<{ [X in K]?: Nullable<boolean> }>,
  key: K,
  def: boolean,
): boolean {
  return (!build || isNull(build[key])) ? def : build[key] as boolean;
}
