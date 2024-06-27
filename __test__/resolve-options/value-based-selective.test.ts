import { error } from '../../src/api/errors/error';
import { invalidOptionMessage } from '../../src/api/errors/error-messages';
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS } from '../../src/api/selective/consts';
import { resolveValueBasedSelectiveOption } from '../../src/api/selective/object-based';
import { isString } from '../../src/api/type-check/basic';

describe('value based selective option', () => {

  const optionName = 'option';
  const urlHash = 'hash';

  const resolve = (value: unknown) => {
    return resolveValueBasedSelectiveOption(
      value,
      MODULE_BUILD_KEYS,
      API_SPECIAL_KEYS,
      isString,
      null,
      optionName,
      urlHash,
    );
  };

  test('Should throw on invalid value', () => {

    const invalidValues = [
      0,
      1,
      true,
      false,
      [],
      { invalid: 'valid' },
      { cli: 'invalid' },
      { default: true },
      { api: false },
      { main: 100 },
      { module: -100 },
      { browser: false },
      { bin: 0 },
    ];

    invalidValues.forEach((invalid) => {
      expect(() => resolve(invalid)).toThrow(
        error(invalidOptionMessage(optionName, urlHash)),
      );
    });

  });

  test('Should resolve null or undefined value', () => {
    [null, undefined].forEach((value) => {

      expect(resolve(value)).toEqual({
        main: null,
        module: null,
        browser: null,
        bin: null,
      });

    });
  });

  test('Should resolve string value', () => {

    const value = 'filename.js';

    expect(resolve(value)).toEqual({
      main: value,
      module: value,
      browser: value,
      bin: value,
    });

  });

  test('Should resolve object value', () => {

    const values = [
      {
        value: {},
        expected: {},
      },
      {
        value: { default: null },
        expected: {},
      },
      {
        value: { default: undefined },
        expected: {},
      },
      {
        value: { default: 'default.js' },
        expected: { main: 'default.js', module: 'default.js', browser: 'default.js', bin: 'default.js' },
      },
      {
        value: { default: 'default.js', api: 'api.js' },
        expected: { main: 'api.js', module: 'api.js', browser: 'api.js', bin: 'default.js' },
      },
      {
        value: { default: 'default.js', module: 'module.js' },
        expected: { main: 'default.js', module: 'module.js', browser: 'default.js', bin: 'default.js' },
      },
      {
        value: { main: 'main.js', module: null, browser: undefined },
        expected: { main: 'main.js' },
      },
    ];

    values.forEach(({ value, expected }) => {
      expect(resolve(value)).toEqual({
        main: null,
        module: null,
        browser: null,
        bin: null,
        ...expected,
      });
    });

  });

});
