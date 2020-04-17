import { resolveSelectiveBoolOption } from '../../src/api/options/boolean';
import { ALL_KEYS, isBuildTypeString } from '../../src/api/options/selective';

describe('boolean option', () => {

  test('Should throw on invalid boolean option', () => {
    const invalids = [
      0,
      1,
      'invalid',
      ['invalid'],
      { cli: true },
      { default: 'invalid' },
      { api: 'invalid' },
      { main: 'invalid' },
      { module: 'invalid' },
      { browser: 'invalid' },
      { bin: 'invalid' },
    ];
    invalids.forEach((invalid) => {
      [true, false].forEach((defaultValue) => {
        expect(() => resolveSelectiveBoolOption(invalid as never, defaultValue, isBuildTypeString, ALL_KEYS, 'boolean', 'url')).toThrow();
      });
    });
  });

  test('Should resolve null or undefined boolean option', () => {
    [null, undefined].forEach((value) => {
      [true, false].forEach((defaultValue) => {
        expect(resolveSelectiveBoolOption(value, defaultValue, isBuildTypeString, ALL_KEYS, 'boolean', 'url')).toEqual({
          main: defaultValue,
          module: defaultValue,
          browser: defaultValue,
          bin: defaultValue,
        });
      });
    });
  });

  test('Should resolve boolean option', () => {
    [true, false].forEach((value) => {
      [true, false].forEach((defaultValue) => {
        expect(resolveSelectiveBoolOption(value, defaultValue, isBuildTypeString, ALL_KEYS, 'boolean', 'url')).toEqual({
          main: value,
          module: value,
          browser: value,
          bin: value,
        });
      });
    });
  });

  test('Should resolve build type boolean option', () => {
    const values = [
      { value: 'main' as 'main', expected: { main: true, module: false, browser: false, bin: false } },
      { value: 'module' as 'module', expected: { main: false, module: true, browser: false, bin: false } },
      { value: 'browser' as 'browser', expected: { main: false, module: false, browser: true, bin: false } },
      { value: 'bin' as 'bin', expected: { main: false, module: false, browser: false, bin: true } },
      { value: 'api' as 'api', expected: { main: true, module: true, browser: true, bin: false } },
    ];
    values.forEach(({ value, expected }) => {
      [true, false].forEach((defaultValue) => {
        expect(resolveSelectiveBoolOption(value, defaultValue, isBuildTypeString, ALL_KEYS, 'boolean', 'url')).toEqual(expected);
      });
    });
  });

  test('Should resolve array of build type as boolean option', () => {
    const values = [
      { value: ['main', 'bin'] as ['main', 'bin'], expected: { main: true, module: false, browser: false, bin: true } },
      { value: ['api'] as ['api'], expected: { main: true, module: true, browser: true, bin: false } },
    ];
    values.forEach(({ value: array, expected }) => {
      [true, false].forEach((defaultValue) => {
        expect(resolveSelectiveBoolOption(array, defaultValue, isBuildTypeString, ALL_KEYS, 'boolean', 'url')).toEqual(expected);
      });
    });
  });

  test('Should resolve selective object boolean option', () => {
    const values = [
      {
        value: {},
        expected: {},
      },
      {
        value: { default: false },
        expected: { main: false, module: false, browser: false, bin: false },
      },
      {
        value: { default: true },
        expected: { main: true, module: true, browser: true, bin: true },
      },
      {
        value: { default: false, main: true },
        expected: { main: true, module: false, browser: false, bin: false },
      },
      {
        value: { default: true, module: false },
        expected: { main: true, module: false, browser: true, bin: true },
      },
      {
        value: { default: false, api: true, browser: false },
        expected: { main: true, module: true, browser: false, bin: false },
      },
      {
        value: { main: false, module: null, browser: undefined },
        expected: { main: false },
      },
      {
        value: { main: true, module: null, bin: undefined },
        expected: { main: true },
      },
    ];
    values.forEach(({ value, expected }) => {
      [true, false].forEach((defaultValue) => {
        expect(resolveSelectiveBoolOption(value, defaultValue, isBuildTypeString, ALL_KEYS, 'boolean', 'url')).toEqual({
          main: defaultValue,
          module: defaultValue,
          browser: defaultValue,
          bin: defaultValue,
          ...expected,
        });
      });
    });
  });

});
