import analize from '../tools/analize';
import { SelectiveOption, BuildType } from '../../src/api/bundlib-options';

describe('interop option', () => {

  const cwd = process.cwd();

  const analizeWithInterop = (interop: SelectiveOption<BuildType, boolean>) => analize(cwd, {
    main: 'main.js',
    browser: 'browser.js',
    bin: 'bin.js',
    bundlib: { interop },
  });

  const analizeWithBuildInterop = (field: string, interop: SelectiveOption<BuildType, boolean>) => analize(cwd, {
    main: 'main.js',
    browser: 'browser.js',
    bin: 'bin.js',
    bundlib: { interop: !interop, [field]: { interop } },
  });

  test('should throw on invalid interop option', () => {

    const invalid = [
      1,
      'main-',
      'browser-',
      'bin-',
      ['main-'],
      ['main', 'browser-'],
    ];

    expect.assertions(invalid.length);

    invalid.forEach((interop) => {
      void expect(analizeWithInterop(interop as never)).rejects.toThrow(TypeError);
    });

  });

  test('should read string main interop option', async () => {
    const { main, browser, bin } = await analizeWithInterop('main');
    expect(main ? main.interop : null).toBe(true);
    expect(browser ? browser.interop : null).toBe(false);
    expect(bin ? bin.interop : null).toBe(false);
  });

  test('should read string browser interop option', async () => {
    const { main, browser, bin } = await analizeWithInterop('browser');
    expect(main ? main.interop : null).toBe(false);
    expect(browser ? browser.interop : null).toBe(true);
    expect(bin ? bin.interop : null).toBe(false);
  });

  test('should read string bin interop option', async () => {
    const { main, browser, bin } = await analizeWithInterop('bin');
    expect(main ? main.interop : null).toBe(false);
    expect(browser ? browser.interop : null).toBe(false);
    expect(bin ? bin.interop : null).toBe(true);
  });

  test('should read array interop option', async () => {
    const { main, browser, bin } = await analizeWithInterop(['main', 'bin']);
    expect(main ? main.interop : null).toBe(true);
    expect(browser ? browser.interop : null).toBe(false);
    expect(bin ? bin.interop : null).toBe(true);
  });

  test('should read true as interop option', async () => {
    const { main, browser, bin } = await analizeWithInterop(true);
    expect(main ? main.interop : null).toBe(true);
    expect(browser ? browser.interop : null).toBe(true);
    expect(bin ? bin.interop : null).toBe(true);
  });

  test('should read false interop option', async () => {
    const { main, browser, bin } = await analizeWithInterop(false);
    expect(main ? main.interop : null).toBe(false);
    expect(browser ? browser.interop : null).toBe(false);
    expect(bin ? bin.interop : null).toBe(false);
  });

  test('should read per-build main interop option', async () => {
    const { main, browser, bin } = await analizeWithBuildInterop('main', true);
    expect(main ? main.interop : null).toBe(true);
    expect(browser ? browser.interop : null).toBe(false);
    expect(bin ? bin.interop : null).toBe(false);
  });

  test('should read per-build browser interop option', async () => {
    const { main, browser, bin } = await analizeWithBuildInterop('browser', true);
    expect(main ? main.interop : null).toBe(false);
    expect(browser ? browser.interop : null).toBe(true);
    expect(bin ? bin.interop : null).toBe(false);
  });

  test('should read per-build bin interop option', async () => {
    const { main, browser, bin } = await analizeWithBuildInterop('bin', true);
    expect(main ? main.interop : null).toBe(false);
    expect(browser ? browser.interop : null).toBe(false);
    expect(bin ? bin.interop : null).toBe(true);
  });

  test('should default to false if interop option not provided', async () => {

    const { main, browser, bin } = await analize(cwd, {
      main: 'out/lib.cjs.js',
      browser: 'out/lib.umd.js',
      bin: 'out/lib.bin.js',
    });

    expect(main ? main.interop : null).toBe(false);
    expect(browser ? browser.interop : null).toBe(false);
    expect(bin ? bin.interop : null).toBe(false);

  });

  test('should read per-build interop option over top-level one', async () => {

    const { main, browser, bin } = await analize(cwd, {
      main: 'main.js',
      browser: 'browser.js',
      bin: 'bin.js',
      bundlib: {
        interop: true,
        main: { interop: false },
        browser: { interop: false },
        bin: { interop: false },
      },
    });

    expect(main ? main.interop : null).toBe(false);
    expect(browser ? browser.interop : null).toBe(false);
    expect(bin ? bin.interop : null).toBe(false);

  });

});
