import { TypesOptions } from '../bundlib-options'
import { createInList } from './in-list'

export const isTypesOptionKey = createInList<keyof TypesOptions>(
  'equals',
)
