import { TypesOptions } from '../../bundlib-options';
import { createOneOfLiteral } from '../../type-check/advanced';

export const isTypesOptionKey = createOneOfLiteral<keyof TypesOptions>('equals');
