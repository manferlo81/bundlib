import { TypesOptions } from '../bundlib-options';
import { createEqualsCheck } from '../type-check/advanced';

export const isTypesOptionKey = createEqualsCheck<keyof TypesOptions>('equals');
