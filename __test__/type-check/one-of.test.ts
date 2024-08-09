import { composeOneOf } from '../../src/api/type-check/advanced';
import { isBool, isString } from '../../src/api/type-check/basic';
import { colorizeMessage } from '../tools/colors';
import { arrays, booleans, functions, nullish, numbers, objects, strings } from '../tools/typed-values';

describe(colorizeMessage('composeOneOf function'), () => {

  const isZero = (value: unknown): value is 0 => {
    return value === 0;
  };

  const isStringOrBoolean = composeOneOf<string | boolean>(isString, isBool);
  const isStringOrBooleanOrZero = composeOneOf<string | boolean | 0>(isStringOrBoolean, isZero);

  const stringsAndBooleans = [
    ...strings,
    ...booleans,
  ];

  const nonNumberValues = [
    ...nullish,
    ...arrays,
    ...objects,
    ...functions,
  ];

  test(colorizeMessage('Should return false on not matching values'), () => {

    [...nonNumberValues, ...numbers].forEach((value) => {
      expect(isStringOrBoolean(value)).toBe(false);
    });

    [...nonNumberValues, 1, 100, NaN].forEach((value) => {
      expect(isStringOrBooleanOrZero(value)).toBe(false);
    });

  });

  test(colorizeMessage('Should return true on matching values'), () => {

    stringsAndBooleans.forEach((value) => {
      expect(isStringOrBoolean(value)).toBe(true);
    });

    [...stringsAndBooleans, 0].forEach((value) => {
      expect(isStringOrBooleanOrZero(value)).toBe(true);
    });

  });

});
