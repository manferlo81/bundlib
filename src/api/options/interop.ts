import { SelectiveBooleanOption } from '../bundlib-options';
import { Nullable } from '../helper-types';
import { BooleanBuildOptions, resolveSelectiveBoolOption } from './boolean';

export function resolveSelectiveInteropOption(value: Nullable<SelectiveBooleanOption>): BooleanBuildOptions {
  return resolveSelectiveBoolOption(
    value,
    false,
    'interop',
    'https://github.com/manferlo81/bundlib#interop',
  );
}
