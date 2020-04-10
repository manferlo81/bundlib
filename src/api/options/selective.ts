import { SelectiveTypeString } from '../bundlib-options';
import { createOneOf } from '../type-check/one-of';

export const isBuildTypeString = createOneOf<SelectiveTypeString>(
  'main',
  'module',
  'browser',
  'bin',
  'api',
);

export const isSelectiveObjectKey = createOneOf<'default' | SelectiveTypeString>(
  'default',
  isBuildTypeString,
);
