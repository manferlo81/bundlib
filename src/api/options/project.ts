import type { Resolved } from 'selective-option'
import type { MaybeNull } from '../types/helper-types'
import { resolveStringOption } from './string'
import type { BuildType } from './types/build-type'
import type { SelectiveStringOption } from './types/bundlib'

export function resolveProjectOption(value: SelectiveStringOption): Resolved<BuildType, MaybeNull<string>> {
  return resolveStringOption(
    value,
    'project',
  )
}
