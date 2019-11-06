import { BrowserBuildOptions } from './bundlib-options'
import { createInList } from './in-list'
import { isCJSOptionKey } from './option-main'

export const isBrowserOption = createInList<keyof BrowserBuildOptions>(
  isCJSOptionKey,
  'format',
  'name',
  'id',
  'extend',
  'globals',
)
