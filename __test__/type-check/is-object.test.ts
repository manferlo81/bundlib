import { isObject } from '../../src/api/type-check/basic';
import { colorizeMessage } from '../tools/colors';
import { arrays, booleans, functions, objects, nullish, numbers, strings } from '../tools/typed-values';

describe(colorizeMessage('isObject function'), () => {

  test(colorizeMessage('Should return false on non object and null values'), () => {

    const nonObjectValues = [
      ...numbers,
      ...strings,
      ...booleans,
      ...nullish,
      ...functions,
    ];

    nonObjectValues.forEach((value) => {
      expect(isObject(value)).toBe(false);
    });

  });

  test(colorizeMessage('Should return true on non null object values'), () => {

    const arraysAndObject = [
      ...arrays,
      ...objects,
    ];

    arraysAndObject.forEach((value) => {
      expect(isObject(value)).toBe(true);
    });

  });

});
