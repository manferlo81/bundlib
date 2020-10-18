import type { BuildType, SelectiveOption } from '../../src/api/types/bundlib-options';
import analyze from '../tools/analyze';

describe('min option', () => {

  const cwd = process.cwd();

  const analyzeWithMin = (min: SelectiveOption<BuildType, boolean>) => analyze(cwd, {
    main: 'main.js',
    module: 'module.js',
    browser: 'browser.js',
    bin: 'bin.js',
    bundlib: { min },
  });

  const analyzeWithBuildMin = (field: BuildType, min: SelectiveOption<BuildType, boolean>) => analyze(cwd, {
    main: 'main.js',
    module: 'module.js',
    browser: 'browser.js',
    bin: 'bin.js',
    bundlib: { [field]: { min } },
  });

  test('should throw on invalid min option', () => {

    const invalidMinOptions = [
      1,
      'main-',
      'module-',
      'browser-',
      'bin-',
      ['main-'],
      ['main', 'browser-'],
    ];

    expect.assertions(invalidMinOptions.length);

    invalidMinOptions.forEach((min) => {
      void expect(analyzeWithMin(min as never)).rejects.toThrow(TypeError);
    });

  });

  test('should read string main min option', async () => {

    const { main, module: moduleOut, browser, bin } = await analyzeWithMin('main');

    expect(main ? main.min : null).toBe(true);
    expect(moduleOut ? moduleOut.min : null).toBe(false);
    expect(browser ? browser.min : null).toBe(false);
    expect(bin ? bin.min : null).toBe(false);

  });

  test('should read string module min option', async () => {

    const { main, module: moduleOut, browser, bin } = await analyzeWithMin('module');

    expect(main ? main.min : null).toBe(false);
    expect(moduleOut ? moduleOut.min : null).toBe(true);
    expect(browser ? browser.min : null).toBe(false);
    expect(bin ? bin.min : null).toBe(false);

  });

  test('should read string browser min option', async () => {

    const { main, module: moduleOut, browser, bin } = await analyzeWithMin('browser');

    expect(main ? main.min : null).toBe(false);
    expect(moduleOut ? moduleOut.min : null).toBe(false);
    expect(browser ? browser.min : null).toBe(true);
    expect(bin ? bin.min : null).toBe(false);

  });

  test('should read string bin min option', async () => {

    const { main, module: moduleOut, browser, bin } = await analyzeWithMin('bin');

    expect(main ? main.min : null).toBe(false);
    expect(moduleOut ? moduleOut.min : null).toBe(false);
    expect(browser ? browser.min : null).toBe(false);
    expect(bin ? bin.min : null).toBe(true);

  });

  test('should read array min option', async () => {

    const { main, module: moduleOut, browser, bin } = await analyzeWithMin(['module', 'bin']);

    expect(main ? main.min : null).toEqual(false);
    expect(moduleOut ? moduleOut.min : null).toEqual(true);
    expect(browser ? browser.min : null).toEqual(false);
    expect(bin ? bin.min : null).toEqual(true);

  });

  test('should read true as min option', async () => {

    const { main, module: moduleOut, browser, bin } = await analyzeWithMin(true);

    expect(main ? main.min : null).toEqual(true);
    expect(moduleOut ? moduleOut.min : null).toEqual(true);
    expect(browser ? browser.min : null).toEqual(true);
    expect(bin ? bin.min : null).toEqual(true);

  });

  test('should read false as min option', async () => {

    const { main, module: moduleOut, browser, bin } = await analyzeWithMin(false);

    expect(main ? main.min : null).toEqual(false);
    expect(moduleOut ? moduleOut.min : null).toEqual(false);
    expect(browser ? browser.min : null).toEqual(false);
    expect(bin ? bin.min : null).toEqual(false);

  });

  test('should read per-build main min option', async () => {

    const { main, module: moduleOut, browser, bin } = await analyzeWithBuildMin('main', true);

    expect(main ? main.min : null).toEqual(true);
    expect(moduleOut ? moduleOut.min : null).toEqual(false);
    expect(browser ? browser.min : null).toEqual(false);
    expect(bin ? bin.min : null).toEqual(false);

  });

  test('should read per-build module min option', async () => {

    const { main, module: moduleOut, browser, bin } = await analyzeWithBuildMin('module', true);

    expect(main ? main.min : null).toEqual(false);
    expect(moduleOut ? moduleOut.min : null).toEqual(true);
    expect(browser ? browser.min : null).toEqual(false);
    expect(bin ? bin.min : null).toEqual(false);

  });

  test('should read per-build browser min option', async () => {

    const { main, module: moduleOut, browser, bin } = await analyzeWithBuildMin('browser', true);

    expect(main ? main.min : null).toEqual(false);
    expect(moduleOut ? moduleOut.min : null).toEqual(false);
    expect(browser ? browser.min : null).toEqual(true);
    expect(bin ? bin.min : null).toEqual(false);

  });

  test('should read per-build bin min option', async () => {

    const { main, module: moduleOut, browser, bin } = await analyzeWithBuildMin('bin', true);

    expect(main ? main.min : null).toEqual(false);
    expect(moduleOut ? moduleOut.min : null).toEqual(false);
    expect(browser ? browser.min : null).toEqual(false);
    expect(bin ? bin.min : null).toEqual(true);

  });

  test('should read per-build min option over top-level one', async () => {

    const { main, module: moduleOut, browser, bin } = await analyze(cwd, {
      main: 'main.js',
      module: 'main.js',
      browser: 'main.js',
      bin: 'main.js',
      bundlib: {
        min: true,
        main: { min: false },
        module: { min: false },
        browser: { min: false },
        bin: { min: false },
      },
    });

    expect(main ? main.min : null).toEqual(false);
    expect(moduleOut ? moduleOut.min : null).toEqual(false);
    expect(browser ? browser.min : null).toEqual(false);
    expect(bin ? bin.min : null).toEqual(false);

  });

});
