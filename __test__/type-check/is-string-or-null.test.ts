import { isStringOrNullish } from '../../src/api/type-check/advanced';
import { colorizeMessage } from '../tools/colors';
import { arrays, booleans, functions, objects, nullish, numbers, strings } from '../tools/typed-values';

describe(colorizeMessage('isStringOrNullish function'), () => {

  test(colorizeMessage('Should return false on non string and nullish values'), () => {

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

  test(colorizeMessage('Should return true on string or nullish values'), () => {

    const arraysAndObject = [
      ...strings,
      ...nullish,
    ];

    arraysAndObject.forEach((value) => {
      expect(isStringOrNullish(value)).toBe(true);
    });

  });

});
