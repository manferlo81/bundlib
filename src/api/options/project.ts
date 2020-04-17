import { BuildType, SelectiveStringOption } from '../bundlib-options';
import { Nullable, StrictNullable } from '../helper-types';
import { resolveObjectBasedSelectiveOption } from './object-based';

export type ProjectBuildOptions = Record<BuildType, StrictNullable<string>>;

export function resolveProjectOption(value: Nullable<SelectiveStringOption>): ProjectBuildOptions {
  return resolveObjectBasedSelectiveOption(
    value,
    'project',
    'https://github.com/manferlo81/bundlib#project',
  );
}
