import { composeOneOf, createOneOfLiteral } from '../type-check/advanced'
import { isNullish } from '../type-check/basic'
import type { RollupSupportedBrowserFormat } from '../types/rollup'

const isBrowserFormat = createOneOfLiteral<RollupSupportedBrowserFormat>('iife', 'amd', 'umd')

export const isBrowserFormatOrNullish = composeOneOf(
  isNullish,
  isBrowserFormat,
)
