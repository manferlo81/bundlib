import { isDictionary } from '../../src/api/type-check/basic';
import { arrays, booleans, functions, objects, nullish, numbers, strings } from '../tools/typed-values';

describe('isDictionary function', () => {

  test('Should return false on non object values, including arrays', () => {

    const nonObjectValues = [
      ...numbers,
      ...strings,
      ...booleans,
      ...nullish,
      ...functions,
      ...arrays,
    ];

    nonObjectValues.forEach((value) => {
      expect(isDictionary(value)).toBe(false);
    });

  });

  test('Should return true on object only, no arrays', () => {

    objects.forEach((value) => {
      expect(isDictionary(value)).toBe(true);
    });

  });

});
