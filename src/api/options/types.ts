import { TypesOptions } from '../bundlib-options';
import { createOneOf } from '../type-check/one-of';

export const isTypesOptionKey = createOneOf<keyof TypesOptions>(
  'equals',
);
