import { SelectiveSkipBuildType, SelectiveSkipOption } from '../bundlib-options';
import { Nullable } from '../helper-types';
import { composeOneOf } from '../type-check/advanced';
import { isBool } from '../type-check/basic';
import { ALL_BUILD_KEYS, isSelectiveBuildType } from './object-based';
import { resolveSelectiveOption, SelectiveResolvedBoolean } from './selective';

const isSkipTypeString = composeOneOf<SelectiveSkipBuildType>(
  isSelectiveBuildType,
  'types',
);

export function resolveSkipOption(value: Nullable<SelectiveSkipOption>): SelectiveResolvedBoolean<SelectiveSkipBuildType> {
  return resolveSelectiveOption<SelectiveSkipBuildType, boolean>(
    value,
    false,
    isSkipTypeString,
    isBool,
    ALL_BUILD_KEYS,
    'skip',
  );
}
