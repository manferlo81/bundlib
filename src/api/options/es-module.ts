import { BuildType, SelectiveBooleanOption } from '../bundlib-options';
import { Nullable } from '../helper-types';
import { isBool } from '../type-check/basic';
import { isSelectiveBuildType, MODULE_BUILD_KEYS } from './object-based';
import { resolveSelectiveOption, SelectiveResolvedBoolean } from './selective';

export const resolveESModuleOption = (value: Nullable<SelectiveBooleanOption>): SelectiveResolvedBoolean<BuildType> => (
  resolveSelectiveOption<BuildType, boolean>(
    value,
    false,
    isSelectiveBuildType,
    isBool,
    MODULE_BUILD_KEYS,
    'esModule',
    'https://github.com/manferlo81/bundlib#es-module',
  )
);
