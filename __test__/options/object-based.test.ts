import { resolveObjectBasedSelectiveOption, MODULE_BUILD_KEYS } from '../../src/api/options/object-based';
import { isString } from '../../src/api/type-check/basic';

describe('object based option', () => {

  test('Should throw on invalid object based option', () => {

    const invalids = [
      0,
      1,
      { cli: 'string' },
      { default: true },
      { api: false },
      { main: 100 },
      { module: -100 },
      { browser: false },
      { bin: 0 },
    ];

    invalids.forEach((invalid) => {
      expect(() => resolveObjectBasedSelectiveOption(invalid as never, null, MODULE_BUILD_KEYS, isString, 'string', 'url')).toThrow();
    });

  });

  test('Should resolve null or undefined object based option', () => {
    [null, undefined].forEach((value) => {

      expect(resolveObjectBasedSelectiveOption(value, null, MODULE_BUILD_KEYS, isString, 'string', 'url')).toEqual({
        main: null,
        module: null,
        browser: null,
        bin: null,
      });

    });
  });

  test('Should resolve object based option', () => {

    const value = 'filename.js';

    expect(resolveObjectBasedSelectiveOption(value, null, MODULE_BUILD_KEYS, isString, 'string', 'url')).toEqual({
      main: value,
      module: value,
      browser: value,
      bin: value,
    });

  });

  test('Should resolve selective object object based option', () => {

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

      expect(resolveObjectBasedSelectiveOption(value, null, MODULE_BUILD_KEYS, isString, 'string', 'url')).toEqual({
        main: null,
        module: null,
        browser: null,
        bin: null,
        ...expected,
      });

    });

  });

});
