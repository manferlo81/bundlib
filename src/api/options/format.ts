import { composeOneOf, createOneOfLiteral } from '../type-check/advanced'
import { isNullish } from '../type-check/basic'
import type { BrowserBuildFormat } from '../types/rollup'

const isBrowserFormat = createOneOfLiteral<BrowserBuildFormat>('iife', 'amd', 'umd')

export const isBrowserFormatOrNullish = composeOneOf(
  isNullish,
  isBrowserFormat,
)
