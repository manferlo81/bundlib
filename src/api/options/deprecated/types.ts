import { createOneOfLiteral } from '../../type-check/advanced';
import type { TypesOptions } from '../../types/bundlib-options';

export const isTypesOptionKey = createOneOfLiteral<keyof TypesOptions>('equals');
