import { resolveSourcemapOption } from '../../src/api/options/sourcemap';
import { MODULE_BUILD_KEYS } from '../../src/api/selective/consts';
import { BuildType } from '../../src/api/types/bundlib-options';
import { GetSelectiveResultValue, createSelectiveResult, isApiKey } from '../tools/selective-tools';

describe('resolve "sourcemap" option', () => {

  const createResult = <V>(getValue: GetSelectiveResultValue<BuildType, V>) => {
    return createSelectiveResult<BuildType, V>(MODULE_BUILD_KEYS, getValue);
  };

  test('Should throw on invalid "sourcemap" option', () => {

    const invalidSourcemapOptionValues = [
      0,
      1,
      'invalid',
      ['invalid'],
      { invalid: true },
      { default: 'invalid' },
      { api: 'invalid' },
      { main: 'invalid' },
      { module: 'invalid' },
      { browser: 'invalid' },
      { bin: 'invalid' },
    ];

    invalidSourcemapOptionValues.forEach((invalid) => {
      expect(() => resolveSourcemapOption(invalid as never)).toThrow('Invalid "sourcemap" option');
    });

  });

  test('Should resolve null or undefined "sourcemap" option', () => {
    const expected = createResult(() => true);
    [null, undefined].forEach((value) => {
      expect(resolveSourcemapOption(value)).toEqual(expected);
    });
  });

  test('Should resolve specific "sourcemap" option', () => {
    [true, false, 'inline' as const, 'hidden' as const].forEach((value) => {
      const expected = createResult(() => value);
      expect(resolveSourcemapOption(value)).toEqual(expected);
    });
  });

  test('Should resolve build type as "sourcemap" option', () => {

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
      expect(resolveSourcemapOption(value)).toEqual(expected);
    });

  });

  test('Should resolve array of build type as "sourcemap" option', () => {

    const values = [
      ...MODULE_BUILD_KEYS.map((value) => ({
        value: [value],
        expected: createResult((key) => key === value),
      })),
      {
        value: ['api'] as ['api'],
        expected: {
          main: true, module: true, browser: true, bin: false,
        },
      },
      ...MODULE_BUILD_KEYS.map((value, i) => {
        const next = MODULE_BUILD_KEYS[(i + 1) % MODULE_BUILD_KEYS.length];
        const array = [value, next];
        return {
          value: array,
          expected: createResult((key) => array.includes(key)),
        };
      }),
      ...MODULE_BUILD_KEYS.map((value) => {
        const array = ['api' as const, value];
        return {
          value: array,
          expected: createResult((key) => isApiKey(key) || key === value),
        };
      }),
    ];

    values.forEach(({ value: array, expected }) => {
      expect(resolveSourcemapOption(array)).toEqual(expected);
    });

  });

  test('Should resolve selective object as "sourcemap" option', () => {

    const values = [
      {
        value: {},
        expected: { main: true, module: true, browser: true, bin: true },
      },
      {
        value: { default: false },
        expected: { main: false, module: false, browser: false, bin: false },
      },
      {
        value: { default: false, main: true },
        expected: { main: true, module: false, browser: false, bin: false },
      },
      {
        value: { default: false, api: true, browser: false },
        expected: { main: true, module: true, browser: false, bin: false },
      },
      {
        value: { default: 'inline' as const, api: true, browser: false },
        expected: { main: true, module: true, browser: false, bin: 'inline' },
      },
      {
        value: { default: false, main: 'inline' as const, browser: 'hidden' as const },
        expected: { main: 'inline', module: false, browser: 'hidden', bin: false },
      },
      {
        value: { main: false, module: null },
        expected: { main: false, module: true, browser: true, bin: true },
      },
    ];

    values.forEach(({ value, expected }) => {
      expect(resolveSourcemapOption(value)).toEqual(expected);
    });

  });

});
