import { BuildType, SelectiveStringOption } from '../bundlib-options';
import { StrictNullable } from '../helper-types';
import { isString } from '../type-check/basic';
import { MODULE_BUILD_KEYS, resolveObjectBasedSelectiveOption, SelectiveResolved } from './object-based';

export const resolveInputOption = (value: SelectiveStringOption): SelectiveResolved<BuildType, StrictNullable<string>> => (
  resolveObjectBasedSelectiveOption<string, null>(
    value,
    null,
    isString,
    MODULE_BUILD_KEYS,
    'input',
  )
);
