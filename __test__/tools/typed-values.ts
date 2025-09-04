/* eslint-disable @typescript-eslint/no-unnecessary-type-conversion */

export const falsyNumbers = [
  0,
  NaN,
  Number(0),
  Number(NaN),
];

export const truthyNumbers = [
  1,
  Infinity,
  -Infinity,
  Number(1),
  Number(Infinity),
  Number(-Infinity),
];

export const numbers = [
  ...falsyNumbers,
  ...truthyNumbers,
];

export const falsyStrings = [
  '',
  String(''),
];

export const truthyStrings = [
  'string',
  String('string'),
];

export const strings = [
  ...falsyStrings,
  ...truthyStrings,
];

export const falseBooleans = [
  false,
  Boolean(false),
];

export const trueBooleans = [
  true,
  Boolean(true),
];

export const booleans = [
  ...falseBooleans,
  ...trueBooleans,
];

export const nullish = [
  null,
  undefined,
];

export const functions: unknown[] = [
  () => null,
  Object(() => null),
];

export const arrays: unknown[][] = [
  [],
  [1, '', true],
  new Array([]),
  new Array([1, '', true]),
  new Array(0),
  new Array(5),
];

export const objects: unknown[] = [
  {},
  /reg/,
  new RegExp(''),
  new Object(),
  Object(),
  Object(null),
  Object(undefined),
  Object(''),
  Object('string'),
  Object(0),
  Object(1),
  Object(true),
  Object(false),
  new Number(0),
  new String(''),
  new Boolean(false),
];
