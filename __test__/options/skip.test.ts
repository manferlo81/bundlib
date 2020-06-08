import { resolveSkipOption } from '../../src/api/options/skip';
import { invalidOption } from '../../src/api/errors';

describe('"skip" option', () => {

  test('Should throw on invalid "skip" option', () => {

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
      { types: 'invalid' },
    ];

    invalids.forEach((invalid) => {
      expect(() => resolveSkipOption(invalid as never)).toThrow(
        invalidOption('skip'),
      );
    });

  });

  test('Should resolve null or undefined "skip" option', () => {
    [null, undefined].forEach((value) => {
      expect(resolveSkipOption(value)).toEqual({
        main: false,
        module: false,
        browser: false,
        bin: false,
        types: false,
      });
    });
  });

  test('Should resolve boolean "skip" option', () => {
    [true, false].forEach((value) => {
      expect(resolveSkipOption(value)).toEqual({
        main: value,
        module: value,
        browser: value,
        bin: value,
        types: value,
      });
    });
  });

  test('Should resolve build type "skip" option', () => {

    const values = [
      { value: 'main' as const, expected: { main: true } },
      { value: 'module' as const, expected: { module: true } },
      { value: 'browser' as const, expected: { browser: true } },
      { value: 'bin' as const, expected: { bin: true } },
      { value: 'types' as const, expected: { types: true } },
      { value: 'api' as const, expected: { main: true, module: true, browser: true } },
    ];

    values.forEach(({ value, expected }) => {
      expect(resolveSkipOption(value)).toEqual({
        main: false,
        module: false,
        browser: false,
        bin: false,
        types: false,
        ...expected,
      });
    });

  });

  test('Should resolve array of build type as "skip" option', () => {

    const values = [
      { value: ['main'] as ['main'], expected: { main: true } },
      { value: ['module'] as ['module'], expected: { module: true } },
      { value: ['browser'] as ['browser'], expected: { browser: true } },
      { value: ['bin'] as ['bin'], expected: { bin: true } },
      { value: ['types'] as ['types'], expected: { types: true } },
      { value: ['api'] as ['api'], expected: { main: true, module: true, browser: true } },
      { value: ['main', 'bin'] as ['main', 'bin'], expected: { main: true, bin: true } },
      { value: ['api', 'types'] as ['api', 'types'], expected: { main: true, module: true, browser: true, types: true } },
    ];

    values.forEach(({ value: array, expected }) => {
      expect(resolveSkipOption(array)).toEqual({
        main: false,
        module: false,
        browser: false,
        bin: false,
        types: false,
        ...expected,
      });
    });

  });

  test('Should resolve selective object "skip" option', () => {

    const values = [
      {
        value: {},
        expected: {},
      },
      {
        value: { default: false },
        expected: {},
      },
      {
        value: { default: true },
        expected: { main: true, module: true, browser: true, bin: true, types: true },
      },
      {
        value: { default: false, main: true },
        expected: { main: true },
      },
      {
        value: { default: true, module: false },
        expected: { main: true, browser: true, bin: true, types: true },
      },
      {
        value: { default: false, api: true, browser: false },
        expected: { main: true, module: true },
      },
      {
        value: { api: true, browser: false },
        expected: { main: true, module: true },
      },
      {
        value: { main: false, module: null, browser: undefined },
        expected: {},
      },
      {
        value: { main: true, module: null, bin: undefined },
        expected: { main: true },
      },
    ];

    values.forEach(({ value, expected }) => {
      expect(resolveSkipOption(value)).toEqual({
        main: false,
        module: false,
        browser: false,
        bin: false,
        types: false,
        ...expected,
      });
    });

  });

});
