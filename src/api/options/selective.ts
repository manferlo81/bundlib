import { BuildType, SelectiveOption, SelectiveSkipBuildType, SelectiveType } from '../bundlib-options';
import { invalidOption } from '../errors';
import { Nullable, TypeCheckFunction } from '../helper-types';
import { keysToObject } from '../tools/helpers';
import { composeOneOf } from '../type-check/advanced';
import { isArray, isBool, isNull, isObject } from '../type-check/basic';
import { resolveObjectSelectiveOption, SelectiveResolved } from './object-based';
import { resolveTypeString, resolveTypeStringArray } from './string-based';

export type SelectiveResolvedBoolean<K extends string> = SelectiveResolved<K, boolean>;

export function resolveSelectiveOption<K extends SelectiveSkipBuildType>(
  value: SelectiveOption<SelectiveType<K>, boolean>,
  defaultValue: boolean,
  isSelectiveTypeString: TypeCheckFunction<K>,
  allkeys: K[],
  optionName: string,
  url: string
): SelectiveResolvedBoolean<K>;

export function resolveSelectiveOption<K extends BuildType>(
  value: SelectiveOption<SelectiveType<K>, boolean>,
  defaultValue: boolean,
  isSelectiveTypeString: TypeCheckFunction<K>,
  allkeys: K[],
  optionName: string,
  url: string
): SelectiveResolvedBoolean<K>;

export function resolveSelectiveOption(
  value: SelectiveOption<BuildType, boolean>,
  defaultValue: boolean,
  isSelectiveTypeString: TypeCheckFunction<string>,
  allkeys: string[],
  optionName: string,
  url: string,
): SelectiveResolvedBoolean<string> {

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

  if (isSelectiveTypeString(value)) {
    return resolveTypeString(
      value,
      allkeys,
    );
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
    );
  }

  return resolveObjectSelectiveOption<boolean, boolean>(
    value,
    defaultValue,
    allkeys,
    composeOneOf('default', isSelectiveTypeString),
    isBool,
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
