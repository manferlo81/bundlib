import type { Resolved } from 'selective-option'
import type { SelectiveStringOption } from '../types/bundlib-options'
import type { MaybeNull } from '../types/helper-types'
import type { BuildType } from '../types/options/build-type'
import { resolveStringOption } from './string'

export const resolveInputOption = (value: SelectiveStringOption): Resolved<BuildType, MaybeNull<string>> => {
  return resolveStringOption(
    value,
    'input',
  )
}
