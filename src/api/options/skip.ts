import { SelectiveSkipBuildType, SelectiveSkipOption } from '../bundlib-options';
import { Nullable } from '../helper-types';
import { createOneOf } from '../type-check/one-of';
import { BooleanBuildOptions, resolveSelectiveBoolOption } from './boolean';
import { isBuildTypeString, SKIP_KEYS } from './selective';

const isSkipTypeString = createOneOf(
  'types',
  isBuildTypeString,
);

export function resolveSelectiveSkipOption(value: Nullable<SelectiveSkipOption>): BooleanBuildOptions<SelectiveSkipBuildType> {
  return resolveSelectiveBoolOption(
    value,
    false,
    isSkipTypeString,
    SKIP_KEYS,
    'skip',
    'https://github.com/manferlo81/bundlib#skip',
  );
}
