import { composeOneOf, createOneOfLiteral } from '../type-check/advanced'
import { isNullish } from '../type-check/basic'
import type { BundlibBrowserFormat } from './types/rollup'

const isBrowserFormat = createOneOfLiteral<BundlibBrowserFormat>('iife', 'amd', 'umd')

export const isBrowserFormatOrNullish = composeOneOf(
  isNullish,
  isBrowserFormat,
)
