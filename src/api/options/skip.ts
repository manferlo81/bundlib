import { SelectiveSkipBuildType, SelectiveSkipOption } from '../bundlib-options';
import { Nullable } from '../helper-types';
import { createOneOf } from '../type-check/one-of';
import { BooleanBuildOptions, resolveSelectiveOption } from './selective';
import { isBuildTypeString, SKIP_KEYS } from './string-based';

const isSkipTypeString = createOneOf(
  'types',
  isBuildTypeString,
);

export function resolveSkipOption(value: Nullable<SelectiveSkipOption>): BooleanBuildOptions<SelectiveSkipBuildType> {
  return resolveSelectiveOption(
    value,
    false,
    isSkipTypeString,
    SKIP_KEYS,
    'skip',
    'https://github.com/manferlo81/bundlib#skip',
  );
}
