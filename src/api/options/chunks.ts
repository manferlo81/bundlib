import { composeOneOf } from '../type-check/advanced';
import { isDictionary, isNull } from '../type-check/basic';
import { Dictionary, AllowNullish } from '../types/helper-types';

export const isValidChunks = composeOneOf<AllowNullish<Dictionary<unknown>>>(
  isNull,
  isDictionary,
);
