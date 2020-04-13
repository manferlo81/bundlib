import { BuildType, SelectiveStringOption } from '../bundlib-options';
import { Nullable, StrictNullable } from '../helper-types';
import { resolveSelectiveStringOption } from './string';

export type ProjectBuildOptions = Record<BuildType, StrictNullable<string>>;

export function resolveSelectiveProjectOption(value: Nullable<SelectiveStringOption>): ProjectBuildOptions {
  return resolveSelectiveStringOption(
    value,
    'project',
    'https://github.com/manferlo81/bundlib#project',
  );
}
