import { BuildType, SelectiveBooleanOption } from '../bundlib-options';
import { Nullable } from '../helper-types';
import { isSelectiveBuildType, MODULE_BUILD_KEYS } from './object-based';
import { resolveSelectiveOption, SelectiveResolvedBoolean } from './selective';

export const resolveESModuleOption = (value: Nullable<SelectiveBooleanOption>): SelectiveResolvedBoolean<BuildType> => (
  resolveSelectiveOption(
    value,
    false,
    isSelectiveBuildType,
    MODULE_BUILD_KEYS,
    'esModule',
    'https://github.com/manferlo81/bundlib#es-module',
  )
);
