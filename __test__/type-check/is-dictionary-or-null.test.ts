import { isDictionaryOrNullish } from '../../src/api/type-check/advanced';
import { arrays, booleans, functions, objects, nullish, numbers, strings } from '../tools/typed-values';

describe('isDictionaryOrNull function', () => {

  test('Should return false on non dictionary and null values', () => {

    const nonObjectValues = [
      ...numbers,
      ...strings,
      ...booleans,
      ...functions,
      ...arrays,
    ];

    nonObjectValues.forEach((value) => {
      expect(isDictionaryOrNullish(value)).toBe(false);
    });

  });

  test('Should return true on dictionary and null values', () => {

    const arraysAndObject = [
      ...objects,
      ...nullish,
    ];

    arraysAndObject.forEach((value) => {
      expect(isDictionaryOrNullish(value)).toBe(true);
    });

  });

});
