import { SelectiveBooleanOption } from '../bundlib-options';
import { Nullable } from '../helper-types';
import { BooleanBuildOptions, resolveSelectiveBoolOption } from './boolean';

export function resolveSelectiveESModuleOption(value: Nullable<SelectiveBooleanOption>): BooleanBuildOptions {
  return resolveSelectiveBoolOption(
    value,
    false,
    'esModule',
    'https://github.com/manferlo81/bundlib#es-module',
  );
}
