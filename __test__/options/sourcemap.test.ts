import { error } from '../../src/api/errors/error';
import { invalidOptionMessage } from '../../src/api/errors/error-messages';
import { resolveSourcemapOption } from '../../src/api/options/sourcemap';

describe('"sourcemap" option', () => {

  test('Should throw on invalid "sourcemap" option', () => {

    const invalids = [
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

    invalids.forEach((invalid) => {
      expect(() => resolveSourcemapOption(invalid as never)).toThrow(
        error(invalidOptionMessage('sourcemap')),
      );
    });

  });

  test('Should resolve null or undefined "sourcemap" option', () => {

    [null, undefined].forEach((value) => {
      expect(resolveSourcemapOption(value)).toEqual({
        main: true,
        module: true,
        browser: true,
        bin: true,
      });
    });

  });

  test('Should resolve specific "sourcemap" option', () => {

    [true, false, 'inline' as const, 'hidden' as const].forEach((value) => {
      expect(resolveSourcemapOption(value)).toEqual({
        main: value,
        module: value,
        browser: value,
        bin: value,
      });
    });

  });

  test('Should resolve build type "sourcemap" option', () => {

    const values = [
      { value: 'main' as const, expected: { main: true, module: false, browser: false, bin: false } },
      { value: 'module' as const, expected: { main: false, module: true, browser: false, bin: false } },
      { value: 'browser' as const, expected: { main: false, module: false, browser: true, bin: false } },
      { value: 'bin' as const, expected: { main: false, module: false, browser: false, bin: true } },
      { value: 'api' as const, expected: { main: true, module: true, browser: true, bin: false } },
    ];

    values.forEach(({ value, expected }) => {
      expect(resolveSourcemapOption(value)).toEqual(expected);
    });

  });

  test('Should resolve array of build type as "sourcemap" option', () => {

    const values = [
      { value: ['main', 'bin'] as ['main', 'bin'], expected: { main: true, module: false, browser: false, bin: true } },
      { value: ['api'] as ['api'], expected: { main: true, module: true, browser: true, bin: false } },
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
