import { BuildType, SelectiveStringOption } from '../bundlib-options';
import { Nullable, StrictNullable } from '../helper-types';
import { resolveSelectiveStringOption } from './string';

export type InputBuildOptions = Record<BuildType, StrictNullable<string>>;

export function resolveSelectiveInputOption(value: Nullable<SelectiveStringOption>): InputBuildOptions {
  return resolveSelectiveStringOption(
    value,
    'input',
    'https://github.com/manferlo81/bundlib#input',
  );
}
