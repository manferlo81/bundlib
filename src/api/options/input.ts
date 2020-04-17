import { BuildType, SelectiveStringOption } from '../bundlib-options';
import { Nullable, StrictNullable } from '../helper-types';
import { resolveObjectBasedSelectiveOption } from './object-based';

export type InputBuildOptions = Record<BuildType, StrictNullable<string>>;

export function resolveInputOption(value: Nullable<SelectiveStringOption>): InputBuildOptions {
  return resolveObjectBasedSelectiveOption(
    value,
    'input',
    'https://github.com/manferlo81/bundlib#input',
  );
}
