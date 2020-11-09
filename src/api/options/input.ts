import { MODULE_BUILD_KEYS } from '../selective/consts';
import { resolveObjectBasedSelectiveOption } from '../selective/object-based';
import type { SelectiveResolved } from '../selective/types';
import { isString } from '../type-check/basic';
import type { BuildType, SelectiveStringOption } from '../types/bundlib-options';
import type { StrictNullable } from '../types/helper-types';

export const resolveInputOption = (value: SelectiveStringOption): SelectiveResolved<BuildType, StrictNullable<string>> => (
  resolveObjectBasedSelectiveOption<BuildType, string, null>(
    value,
    MODULE_BUILD_KEYS,
    isString,
    null,
    'input',
  )
);
