import { invalidOption } from '../../src/api/errors';
import { MODULE_BUILD_KEYS } from '../../src/api/selective/consts';
import { resolveBoolBasedSelectiveOption } from '../../src/api/selective/selective';
import { SelectiveResolved } from '../../src/api/selective/types';
import { isBool } from '../../src/api/type-check/basic';
import type { BuildType } from '../../src/api/types/bundlib-options';

describe('selective option', () => {

  const optionName = 'boolean';
  const urlHash = 'bool';

  function resolve<D>(
    value: unknown,
    defaultValue: D,
  ): SelectiveResolved<BuildType, boolean | D> {
    return resolveBoolBasedSelectiveOption<BuildType, boolean, D>(
      value,
      MODULE_BUILD_KEYS,
      isBool,
      defaultValue,
      optionName,
      urlHash,
    );
  }

  test('Should throw on invalid selective option', () => {

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

    const optionName = 'boolean';
    const urlHash = 'bool';

    invalids.forEach((invalid) => {
      [true, false].forEach((defaultValue) => {
        expect(() => resolve(invalid as never, defaultValue)).toThrow(
          invalidOption(optionName, urlHash),
        );
      });
    });

  });

  test('Should resolve null or undefined selective option', () => {
    [null, undefined].forEach((value) => {
      [true, false].forEach((defaultValue) => {
        expect(resolve(value, defaultValue)).toEqual({
          main: defaultValue,
          module: defaultValue,
          browser: defaultValue,
          bin: defaultValue,
        });
      });
    });
  });

  test('Should resolve selective option', () => {
    [true, false].forEach((value) => {
      [true, false].forEach((defaultValue) => {
        expect(resolve<typeof defaultValue>(value, defaultValue)).toEqual({
          main: value,
          module: value,
          browser: value,
          bin: value,
        });
      });
    });
  });

  test('Should resolve build type selective option', () => {

    const values = [
      { value: 'main' as const, expected: { main: true, module: false, browser: false, bin: false } },
      { value: 'module' as const, expected: { main: false, module: true, browser: false, bin: false } },
      { value: 'browser' as const, expected: { main: false, module: false, browser: true, bin: false } },
      { value: 'bin' as const, expected: { main: false, module: false, browser: false, bin: true } },
      { value: 'api' as const, expected: { main: true, module: true, browser: true, bin: false } },
    ];

    values.forEach(({ value, expected }) => {
      [true, false].forEach((defaultValue) => {
        expect(resolve<typeof defaultValue>(value, defaultValue)).toEqual(expected);
      });
    });

  });

  test('Should resolve array of build type as selective option', () => {

    const values = [
      { value: ['main', 'bin'] as ['main', 'bin'], expected: { main: true, module: false, browser: false, bin: true } },
      { value: ['api'] as ['api'], expected: { main: true, module: true, browser: true, bin: false } },
    ];

    values.forEach(({ value: array, expected }) => {
      [true, false].forEach((defaultValue) => {
        expect(resolve<typeof defaultValue>(array, defaultValue)).toEqual(expected);
      });
    });

  });

  test('Should resolve selective object selective option', () => {

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
        expect(resolve(value, defaultValue)).toEqual({
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
