import { createOneOfLiteral } from '../../type-check/advanced';
import { DeprecatedTypesOptions } from '../../types/deprecated-options';

export const isTypesOptionKey = createOneOfLiteral<keyof DeprecatedTypesOptions>('equals');
