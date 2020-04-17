import { resolveSourcemapOption } from '../../src/api/options/sourcemap';

describe('"sourcemap" option', () => {

  test('Should throw on invalid "sourcemap" option', () => {
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
      expect(() => resolveSourcemapOption(invalid as never)).toThrow();
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
    [true, false, 'inline' as 'inline', 'hidden' as 'hidden'].forEach((value) => {
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
      { value: 'main' as 'main', expected: { main: true, module: false, browser: false, bin: false } },
      { value: 'module' as 'module', expected: { main: false, module: true, browser: false, bin: false } },
      { value: 'browser' as 'browser', expected: { main: false, module: false, browser: true, bin: false } },
      { value: 'bin' as 'bin', expected: { main: false, module: false, browser: false, bin: true } },
      { value: 'api' as 'api', expected: { main: true, module: true, browser: true, bin: false } },
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
        value: { default: 'inline' as 'inline', api: true, browser: false },
        expected: { main: true, module: true, browser: false, bin: 'inline' },
      },
      {
        value: { default: false, main: 'inline' as 'inline', browser: 'hidden' as 'hidden' },
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
