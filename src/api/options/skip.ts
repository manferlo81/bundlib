import { BuildType, SelectiveSkipBuildType, SelectiveSkipOption } from '../bundlib-options';
import { Nullable } from '../helper-types';
import { composeOneOf } from '../type-check/advanced';
import { ALL_BUILD_KEYS, isBuildTypeString } from './object-based';
import { resolveSelectiveOption, SelectivePerBuildBooleanValues } from './selective';

const isSkipTypeString = composeOneOf<BuildType | 'types'>(
  isBuildTypeString,
  'types',
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
