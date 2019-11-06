import { Nullable } from './helper-types'
import { createInList } from './in-list'
import { isNull } from './type-check'
import { BrowserBuildFormat } from './types'

export const isBrowserFormat = createInList<Nullable<BrowserBuildFormat>>(
  isNull,
  'iife',
  'amd',
  'umd',
)
