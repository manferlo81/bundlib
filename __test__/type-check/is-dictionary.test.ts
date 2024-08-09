import { isDictionary } from '../../src/api/type-check/basic';
import { colorizeMessage } from '../tools/colors';
import { arrays, booleans, functions, objects, nullish, numbers, strings } from '../tools/typed-values';

describe(colorizeMessage('isDictionary function'), () => {

  test(colorizeMessage('Should return false on non object values, including arrays'), () => {

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

  test(colorizeMessage('Should return true on object only'), () => {

    objects.forEach((value) => {
      expect(isDictionary(value)).toBe(true);
    });

  });

});
