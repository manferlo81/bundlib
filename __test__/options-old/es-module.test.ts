import type { BuildType, SelectiveOption } from '../../src/api/types/bundlib-options';
import analize from '../tools/analize';

describe('esModule option', () => {

  const cwd = process.cwd();

  const analizeWithESModule = (esModule: SelectiveOption<BuildType, boolean>) => analize(cwd, {
    main: 'main.js',
    browser: 'browser.js',
    bin: 'bin.js',
    bundlib: { esModule },
  });

  const analizeWithBuildESModule = (field: string, esModule: SelectiveOption<BuildType, boolean>) => analize(cwd, {
    main: 'main.js',
    browser: 'browser.js',
    bin: 'bin.js',
    bundlib: { esModule: !esModule, [field]: { esModule } },
  });

  test('should throw on invalid esModule option', () => {

    const invalid = [
      1,
      'main-',
      'browser-',
      'bin-',
      ['main-'],
      ['main', 'browser-'],
    ];

    expect.assertions(invalid.length);

    invalid.forEach((esModule) => {
      void expect(analizeWithESModule(esModule as never)).rejects.toThrow(TypeError);
    });

  });

  test('should read string main esModule option', async () => {

    const { main, browser, bin } = await analizeWithESModule('main');

    expect(main ? main.esModule : null).toBe(true);
    expect(browser ? browser.esModule : null).toBe(false);
    expect(bin ? bin.esModule : null).toBe(false);

  });

  test('should read string browser esModule option', async () => {

    const { main, browser, bin } = await analizeWithESModule('browser');

    expect(main ? main.esModule : null).toBe(false);
    expect(browser ? browser.esModule : null).toBe(true);
    expect(bin ? bin.esModule : null).toBe(false);

  });

  test('should read string bin esModule option', async () => {

    const { main, browser, bin } = await analizeWithESModule('bin');

    expect(main ? main.esModule : null).toBe(false);
    expect(browser ? browser.esModule : null).toBe(false);
    expect(bin ? bin.esModule : null).toBe(true);

  });

  test('should read array esModule option', async () => {

    const { main, browser, bin } = await analizeWithESModule(['main', 'bin']);

    expect(main ? main.esModule : null).toBe(true);
    expect(browser ? browser.esModule : null).toBe(false);
    expect(bin ? bin.esModule : null).toBe(true);

  });

  test('should read true as esModule option', async () => {

    const { main, browser, bin } = await analizeWithESModule(true);

    expect(main ? main.esModule : null).toBe(true);
    expect(browser ? browser.esModule : null).toBe(true);
    expect(bin ? bin.esModule : null).toBe(true);

  });

  test('should read false as esModule option', async () => {

    const { main, browser, bin } = await analizeWithESModule(false);

    expect(main ? main.esModule : null).toBe(false);
    expect(browser ? browser.esModule : null).toBe(false);
    expect(bin ? bin.esModule : null).toBe(false);

  });

  test('should read per-build main esModule option', async () => {

    const { main, browser, bin } = await analizeWithBuildESModule('main', true);

    expect(main ? main.esModule : null).toBe(true);
    expect(browser ? browser.esModule : null).toBe(false);
    expect(bin ? bin.esModule : null).toBe(false);

  });

  test('should read per-build browser esModule option', async () => {

    const { main, browser, bin } = await analizeWithBuildESModule('browser', true);

    expect(main ? main.esModule : null).toBe(false);
    expect(browser ? browser.esModule : null).toBe(true);
    expect(bin ? bin.esModule : null).toBe(false);

  });

  test('should read per-build bin esModule option', async () => {

    const { main, browser, bin } = await analizeWithBuildESModule('bin', true);

    expect(main ? main.esModule : null).toBe(false);
    expect(browser ? browser.esModule : null).toBe(false);
    expect(bin ? bin.esModule : null).toBe(true);

  });

  test('should default to false if esModule option not provided', async () => {

    const { main, browser, bin } = await analize(cwd, {
      main: 'out/lib.cjs.js',
      browser: 'out/lib.umd.js',
      bin: 'out/lib.bin.js',
    });

    expect(main ? main.esModule : null).toBe(false);
    expect(browser ? browser.esModule : null).toBe(false);
    expect(bin ? bin.esModule : null).toBe(false);

  });

  test('should read per-build esModule option over top-level one', async () => {

    const { main, browser, bin } = await analize(cwd, {
      main: 'main.js',
      browser: 'browser.js',
      bin: 'bin.js',
      bundlib: {
        esModule: true,
        main: { esModule: false },
        browser: { esModule: false },
        bin: { esModule: false },
      },
    });

    expect(main ? main.esModule : null).toBe(false);
    expect(browser ? browser.esModule : null).toBe(false);
    expect(bin ? bin.esModule : null).toBe(false);

  });

});
