import { isStringOrNullish } from '../../src/api/type-check/advanced';
import { arrays, booleans, functions, objects, nullish, numbers, strings } from '../tools/typed-values';

describe('isStringOrNull function', () => {

  test('Should return false on non string and null values', () => {

    const nonObjectValues = [
      ...numbers,
      ...booleans,
      ...functions,
      ...arrays,
      ...objects,
    ];

    nonObjectValues.forEach((value) => {
      expect(isStringOrNullish(value)).toBe(false);
    });

  });

  test('Should return true on string or null values', () => {

    const arraysAndObject = [
      ...strings,
      ...nullish,
    ];

    arraysAndObject.forEach((value) => {
      expect(isStringOrNullish(value)).toBe(true);
    });

  });

});
