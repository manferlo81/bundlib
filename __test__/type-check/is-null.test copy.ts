import { isNull } from '../../src/api/type-check/basic';
import { arrays, booleans, functions, objects, nullish, numbers, strings } from '../tools/typed-values';

describe('isNull function', () => {

  test('Should return false on non null values', () => {

    const nonObjectValues = [
      ...numbers,
      ...strings,
      ...booleans,
      ...functions,
      ...arrays,
      ...objects,
    ];

    nonObjectValues.forEach((value) => {
      expect(isNull(value)).toBe(false);
    });

  });

  test('Should return true on null & undefined values', () => {

    nullish.forEach((value) => {
      expect(isNull(value)).toBe(true);
    });

  });

});
