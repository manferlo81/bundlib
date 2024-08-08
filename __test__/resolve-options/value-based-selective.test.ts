import { error } from '../../src/api/errors/error';
import { invalidOptionMessage } from '../../src/api/errors/error-messages';
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS } from '../../src/api/selective/consts';
import { resolveValueBasedSelectiveOption } from '../../src/api/selective/object-based';
import { isString } from '../../src/api/type-check/basic';
import { BuildType } from '../../src/api/types/bundlib-options';
import { GetSelectiveResultValue, createSelectiveResult, isApiKey } from '../tools/selective-tools';

describe('resolve value based selective option', () => {

  const optionName = 'option';

  const resolveValueBased = (value: unknown) => {
    return resolveValueBasedSelectiveOption(
      value,
      MODULE_BUILD_KEYS,
      API_SPECIAL_KEYS,
      isString,
      null,
      optionName,
    );
  };

  const createResult = <V>(getValue: GetSelectiveResultValue<BuildType, V>) => {
    return createSelectiveResult<BuildType, V>(MODULE_BUILD_KEYS, getValue);
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
      expect(() => resolveValueBased(invalid)).toThrow(
        error(invalidOptionMessage(optionName)),
      );
    });

  });

  test('Should resolve null or undefined value', () => {
    const expected = createResult(() => null);
    [null, undefined].forEach((value) => {
      expect(resolveValueBased(value)).toEqual(expected);
    });
  });

  test('Should resolve string value', () => {
    const values = [
      '',
      'filename.js',
    ];
    values.map((value) => {
      const expected = createResult(() => value);
      expect(resolveValueBased(value)).toEqual(expected);
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
        value: { default: '' },
        expected: createResult(() => ''),
      },
      {
        value: { default: 'default.js' },
        expected: createResult(() => 'default.js'),
      },
      {
        value: { default: 'default.js', api: 'api.js' },
        expected: createResult((key) => isApiKey(key) ? 'api.js' : 'default.js'),
      },
      {
        value: { default: 'default.js', module: 'module.js' },
        expected: createResult((key) => key === 'module' ? 'module.js' : 'default.js'),
      },
      {
        value: { main: 'main.js', module: null, browser: undefined },
        expected: createSelectiveResult(['main' as const], () => 'main.js'),
      },
    ];

    values.forEach(({ value, expected }) => {
      expect(resolveValueBased(value)).toEqual({
        ...createResult(() => null),
        ...expected,
      });
    });

  });

});
