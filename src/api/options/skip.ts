import { SelectiveSkipBuildType, SelectiveSkipOption } from '../bundlib-options';
import { Nullable } from '../helper-types';
import { composeOneOf, createEqualsCheck } from '../type-check/advanced';
import { BooleanBuildOptions, resolveSelectiveOption } from './selective';
import { isBuildTypeString, SKIP_KEYS } from './string-based';

const isSkipTypeString = composeOneOf(
  createEqualsCheck<'types'>('types'),
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
