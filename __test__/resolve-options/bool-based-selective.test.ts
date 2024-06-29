import { type SelectiveResolved } from 'selective-option';
import { resolveBoolBasedSelectiveOption } from '../../src/api/selective/bool-based';
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS } from '../../src/api/selective/consts';
import { isBool } from '../../src/api/type-check/basic';
import { type BuildType } from '../../src/api/types/bundlib-options';
import { GetSelectiveResultValue, createSelectiveResult, isApiKey } from '../tools/selective-tools';

describe('resolve boolean based selective option', () => {

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

  const createResult = <V>(getValue: GetSelectiveResultValue<BuildType, V>) => {
    return createSelectiveResult<BuildType, V>(
      MODULE_BUILD_KEYS,
      getValue,
    );
  };

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
    [null, undefined].forEach((nullishValue) => {
      [true, false].forEach((defaultValue) => {
        const expected = createResult(() => defaultValue);
        expect(resolveBoolBased(nullishValue, defaultValue)).toEqual(expected);
      });
    });
  });

  test('Should resolve boolean value', () => {
    [true, false].forEach((value) => {
      const expected = createResult(() => value);
      [true, false].forEach((defaultValue) => {
        expect(resolveBoolBased<typeof defaultValue>(value, defaultValue)).toEqual(expected);
      });
    });
  });

  test('Should resolve build type value', () => {

    const values = [
      ...MODULE_BUILD_KEYS.map((value) => ({
        value,
        expected: createResult((key) => key === value),
      })),
      {
        value: 'api' as const,
        expected: createResult(isApiKey),
      },
    ];
    values.forEach(({ value, expected }) => {
      [true, false].forEach((defaultValue) => {
        expect(resolveBoolBased(value, defaultValue)).toEqual(expected);
      });
    });

  });

  test('Should resolve array of build type value', () => {

    const values = [
      ...MODULE_BUILD_KEYS.map((value) => ({
        value: [value],
        expected: createResult((key) => key === value),
      })),
      {
        value: ['api'] as ['api'],
        expected: createResult(isApiKey),
      },
      ...MODULE_BUILD_KEYS.map((value, i) => {
        const next = MODULE_BUILD_KEYS[(i + 1) % MODULE_BUILD_KEYS.length];
        const array = [value, next];
        return ({
          value: array,
          expected: createResult((key) => array.includes(key)),
        });
      }),
      {
        value: ['api' as const, 'bin' as const],
        expected: createResult(() => true),
      },
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
        expected: createResult(() => false),
      },
      {
        value: { default: true },
        expected: createResult(() => true),
      },
      {
        value: { default: false, main: true },
        expected: createResult((key) => key === 'main'),
      },
      {
        value: { default: true, module: false },
        expected: createResult((key) => key !== 'module'),
      },
      {
        value: { default: false, api: true, browser: false },
        expected: createResult((key) => isApiKey(key) && key !== 'browser'),
      },
      {
        value: { main: false, module: null, browser: undefined },
        expected: createSelectiveResult(['main'], () => false),
      },
      {
        value: { main: true, module: null, bin: undefined },
        expected: createSelectiveResult(['main'], () => true),
      },
    ];

    values.forEach(({ value, expected }) => {
      [true, false].forEach((defaultValue) => {
        expect(resolveBoolBased(value, defaultValue)).toEqual({
          ...createResult(() => defaultValue),
          ...expected,
        });
      });
    });

  });

});
