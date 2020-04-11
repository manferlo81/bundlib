import { resolveSelectiveMinOption } from '../../src/api/options/min';

describe('"min" option', () => {

  test('Should throw on invalid "min" option', () => {
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
      expect(() => resolveSelectiveMinOption(invalid as never)).toThrow();
    });
  });

  test('Should resolve null or undefined "min" option', () => {
    [null, undefined].forEach((value) => {
      expect(resolveSelectiveMinOption(value)).toEqual({
        main: false,
        module: false,
        browser: false,
        bin: false,
      });
    });
  });

  test('Should resolve boolean "min" option', () => {
    [true, false].forEach((value) => {
      expect(resolveSelectiveMinOption(value as never)).toEqual({
        main: value,
        module: value,
        browser: value,
        bin: value,
      });
    });
  });

  test('Should resolve build type "min" option', () => {
    const values = [
      { value: 'main', expected: { main: true, module: false, browser: false, bin: false } },
      { value: 'module', expected: { main: false, module: true, browser: false, bin: false } },
      { value: 'browser', expected: { main: false, module: false, browser: true, bin: false } },
      { value: 'bin', expected: { main: false, module: false, browser: false, bin: true } },
      { value: 'api', expected: { main: true, module: true, browser: true, bin: false } },
    ];
    values.forEach(({ value, expected }) => {
      expect(resolveSelectiveMinOption(value as never)).toEqual(expected);
    });
  });

  test('Should resolve array of build type as "min" option', () => {
    const values = [
      { value: ['main', 'bin'], expected: { main: true, module: false, browser: false, bin: true } },
      { value: ['api'], expected: { main: true, module: true, browser: true, bin: false } },
    ];
    values.forEach(({ value: array, expected }) => {
      expect(resolveSelectiveMinOption(array as never)).toEqual(expected);
    });
  });

});
