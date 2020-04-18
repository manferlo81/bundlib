import { SelectiveSkipBuildType, SelectiveSkipOption } from '../bundlib-options';
import { Nullable } from '../helper-types';
import { composeOneOf, createEqualsCheck } from '../type-check/advanced';
import { isBuildTypeString, ALL_BUILD_KEYS } from './object-based';
import { resolveSelectiveOption, SelectivePerBuildBooleanValues } from './selective';

const isSkipTypeString = composeOneOf(
  createEqualsCheck<'types'>('types'),
  isBuildTypeString,
);

export function resolveSkipOption(value: Nullable<SelectiveSkipOption>): SelectivePerBuildBooleanValues<SelectiveSkipBuildType> {
  return resolveSelectiveOption(
    value,
    false,
    isSkipTypeString,
    ALL_BUILD_KEYS,
    'skip',
    'https://github.com/manferlo81/bundlib#skip',
  );
}
