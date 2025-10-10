import type { Resolved } from 'selective-option'
import type { BuildType, SelectiveStringOption } from '../types/bundlib-options'
import type { MaybeNull } from '../types/helper-types'
import { resolveStringOption } from './string'

export const resolveInputOption = (value: SelectiveStringOption): Resolved<BuildType, MaybeNull<string>> => {
  return resolveStringOption(
    value,
    'input',
  )
}
