import { composeOneOf } from '../type-check/advanced';
import { isDictionary, isNull } from '../type-check/basic';
import { Dictionary, Nullable } from '../types/helper-types';

export const isValidChunks = composeOneOf<Nullable<Dictionary<unknown>>>(
  isNull,
  isDictionary,
);
