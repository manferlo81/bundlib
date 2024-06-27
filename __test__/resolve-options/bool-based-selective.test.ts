import { type SelectiveResolved } from 'selective-option';
import { resolveBoolBasedSelectiveOption } from '../../src/api/selective/bool-based';
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS } from '../../src/api/selective/consts';
import { isBool } from '../../src/api/type-check/basic';
import { type BuildType } from '../../src/api/types/bundlib-options';

describe('boolean based selective option', () => {

  const optionName = 'boolean';
  const urlHash = 'bool';

  function resolveBoolBased<D>(
    value: unknown,
    defaultValue: D,
  ): SelectiveResolved<BuildType, boolean | D> {
    return resolveBoolBasedSelectiveOption<BuildType, boolean, D>(
      value,
      MODULE_BUILD_KEYS,
      API_SPECIAL_KEYS,
      isBool,
      defaultValue,
      optionName,
      urlHash,
    );
  }

  test('Should throw on invalid value', () => {

    const invalidValues = [
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

    invalidValues.forEach((invalid) => {
      [true, false].forEach((defaultValue) => {
        expect(() => resolveBoolBased(invalid as never, defaultValue)).toThrow('Invalid "boolean" option');
      });
    });

  });

  test('Should resolve null or undefined value', () => {
    [null, undefined].forEach((value) => {
      [true, false].forEach((defaultValue) => {
        expect(resolveBoolBased(value, defaultValue)).toEqual({
          main: defaultValue,
          module: defaultValue,
          browser: defaultValue,
          bin: defaultValue,
        });
      });
    });
  });

  test('Should resolve boolean value', () => {
    [true, false].forEach((value) => {
      [true, false].forEach((defaultValue) => {
        expect(resolveBoolBased<typeof defaultValue>(value, defaultValue)).toEqual({
          main: value,
          module: value,
          browser: value,
          bin: value,
        });
      });
    });
  });

  test('Should resolve build type value', () => {

    const values = [
      { value: 'main' as const, expected: { main: true, module: false, browser: false, bin: false } },
      { value: 'module' as const, expected: { main: false, module: true, browser: false, bin: false } },
      { value: 'browser' as const, expected: { main: false, module: false, browser: true, bin: false } },
      { value: 'bin' as const, expected: { main: false, module: false, browser: false, bin: true } },
      { value: 'api' as const, expected: { main: true, module: true, browser: true, bin: false } },
    ];

    values.forEach(({ value, expected }) => {
      [true, false].forEach((defaultValue) => {
        expect(resolveBoolBased<typeof defaultValue>(value, defaultValue)).toEqual(expected);
      });
    });

  });

  test('Should resolve array of build type value', () => {

    const values = [
      { value: ['main', 'bin'] as ['main', 'bin'], expected: { main: true, module: false, browser: false, bin: true } },
      { value: ['api'] as ['api'], expected: { main: true, module: true, browser: true, bin: false } },
    ];

    values.forEach(({ value: array, expected }) => {
      [true, false].forEach((defaultValue) => {
        expect(resolveBoolBased<typeof defaultValue>(array, defaultValue)).toEqual(expected);
      });
    });

  });

  test('Should resolve object value', () => {

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
        expect(resolveBoolBased(value, defaultValue)).toEqual({
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
