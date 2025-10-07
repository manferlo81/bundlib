import type { Resolved } from 'selective-option'
import type { BuildType, SelectiveStringOption } from '../types/bundlib-options'
import type { AllowNull } from '../types/helper-types'
import { resolveStringOption } from './string'

export function resolveProjectOption(value: SelectiveStringOption): Resolved<BuildType, AllowNull<string>> {
  return resolveStringOption(
    value,
    'project',
  )
}
