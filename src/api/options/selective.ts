import { BuildType, SelectiveOption, SelectiveSkipBuildType, SelectiveType } from '../bundlib-options';
import { invalidOption } from '../errors';
import { Nullable, TypeCheckFunction } from '../helper-types';
import { keysToObject } from '../tools/helpers';
import { composeOneOf } from '../type-check/advanced';
import { isArray, isBool, isNull, isObject } from '../type-check/basic';
import { resolveObjectSelectiveOption, SelectiveResolved } from './object-based';
import { resolveTypeString, resolveTypeStringArray } from './string-based';

export type SelectivePerBuildBooleanValues<K extends string> = SelectiveResolved<K, boolean>;

export function resolveSelectiveOption<K extends SelectiveSkipBuildType>(value: SelectiveOption<SelectiveType<K>, boolean>, defaultValue: boolean, isTypeString: TypeCheckFunction<K>, allkeys: K[], name: string, url: string): SelectivePerBuildBooleanValues<K>;
export function resolveSelectiveOption<K extends BuildType>(value: SelectiveOption<SelectiveType<K>, boolean>, defaultValue: boolean, isTypeString: TypeCheckFunction<K>, allkeys: K[], name: string, url: string): SelectivePerBuildBooleanValues<K>;
export function resolveSelectiveOption(value: SelectiveOption<BuildType, boolean>, defaultValue: boolean, isTypeString: TypeCheckFunction<string>, allkeys: string[], name: string, url: string): SelectivePerBuildBooleanValues<string> {

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

  if (isTypeString(value)) {
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
      isTypeString,
      allkeys,
      invalid,
    );
  }

  return resolveObjectSelectiveOption<boolean, boolean>(
    value,
    defaultValue,
    allkeys,
    composeOneOf('default', isTypeString),
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
