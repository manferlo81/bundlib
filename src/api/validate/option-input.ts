import { InputOptions } from '../bundlib-options';
import { createOneOf } from '../type-check/one-of';

export const isInOpKey = createOneOf<keyof InputOptions>('api', 'bin');
