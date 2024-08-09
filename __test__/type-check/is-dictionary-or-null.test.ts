import { isDictionaryOrNullish } from '../../src/api/type-check/advanced';
import { colorizeMessage } from '../tools/colors';
import { arrays, booleans, functions, objects, nullish, numbers, strings } from '../tools/typed-values';

describe(colorizeMessage('isDictionaryOrNullish function'), () => {

  test(colorizeMessage('Should return false on non dictionary and nullish values'), () => {

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

  test(colorizeMessage('Should return true on dictionary and null values'), () => {

    const arraysAndObject = [
      ...objects,
      ...nullish,
    ];

    arraysAndObject.forEach((value) => {
      expect(isDictionaryOrNullish(value)).toBe(true);
    });

  });

});
