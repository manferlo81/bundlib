import { BrowserBuildOptions } from '../bundlib-options';
import { composeOneOf, createOneOfLiteral } from '../type-check/advanced';
import { isCJSOptionKey } from './main-and-bin';

export const isBrowserOption = composeOneOf<keyof BrowserBuildOptions>(
  isCJSOptionKey,
  createOneOfLiteral(
    'format',
    'name',
    'id',
    'extend',
    'globals',
  ),
);
