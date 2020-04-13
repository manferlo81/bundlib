import analize from '../tools/analize';

describe('sourcemap option', () => {

  const cwd = process.cwd();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analizedWithSourcemap = (sourcemap: any) => analize(cwd, {
    main: 'out/lib.cjs.js',
    module: 'out/lib.es.js',
    browser: 'out/lib.umd.js',
    bin: 'out/lib.bin.js',
    bundlib: { sourcemap },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analizedWithBuildSourcemap = (field: any, sourcemap: any) => analize(cwd, {
    main: 'out/lib.cjs.js',
    module: 'out/lib.es.js',
    browser: 'out/lib.umd.js',
    bin: 'out/lib.bin.js',
    bundlib: { [field]: { sourcemap } },
  });

  test('should throw on invalid sourcemap option', () => {

    const invalidSoucemaps = [
      100,
      'string',
    ];

    expect.assertions(invalidSoucemaps.length);

    invalidSoucemaps.forEach((sourcemap) => {
      expect(
        analizedWithSourcemap(sourcemap),
      ).rejects
        .toThrow(TypeError);
    });

  });

  test('should read sourcemap option', async () => {

    const { main, module: moduleOut, browser, bin } = await analizedWithSourcemap(false);

    expect(main ? main.sourcemap : null).toBe(false);
    expect(moduleOut ? moduleOut.sourcemap : null).toBe(false);
    expect(browser ? browser.sourcemap : null).toBe(false);
    expect(bin ? bin.sourcemap : null).toBe(false);

  });

  test('should read "inline" sourcemap option', async () => {

    const sourcemap = 'inline';
    const { main, module: moduleOut, browser, bin } = await analizedWithSourcemap(sourcemap);

    expect(main ? main.sourcemap : null).toBe(sourcemap);
    expect(moduleOut ? moduleOut.sourcemap : null).toBe(sourcemap);
    expect(browser ? browser.sourcemap : null).toBe(sourcemap);
    expect(bin ? bin.sourcemap : null).toBe(sourcemap);

  });

  test('should read "hidden" sourcemap option', async () => {

    const sourcemap = 'hidden';
    const { main, module: moduleOut, browser, bin } = await analizedWithSourcemap(sourcemap);

    expect(main ? main.sourcemap : null).toBe(sourcemap);
    expect(moduleOut ? moduleOut.sourcemap : null).toBe(sourcemap);
    expect(browser ? browser.sourcemap : null).toBe(sourcemap);
    expect(bin ? bin.sourcemap : null).toBe(sourcemap);

  });

  test('should read build sourcemap option', async () => {

    const { main, module: moduleOut, browser, bin } = await analizedWithBuildSourcemap('main', false);

    expect(main ? main.sourcemap : null).toBe(false);
    expect(moduleOut ? moduleOut.sourcemap : null).toBe(true);
    expect(browser ? browser.sourcemap : null).toBe(true);
    expect(bin ? bin.sourcemap : null).toBe(true);

  });

  test('should read build inline sourcemap option', async () => {

    const { main, module: moduleOut, browser, bin } = await analizedWithBuildSourcemap('module', 'inline');

    expect(main ? main.sourcemap : null).toBe(true);
    expect(moduleOut ? moduleOut.sourcemap : null).toBe('inline');
    expect(browser ? browser.sourcemap : null).toBe(true);
    expect(bin ? bin.sourcemap : null).toBe(true);

  });

  test('should default to true if no sourcemap option provided', async () => {

    const { main, module: moduleOut, browser, bin } = await analize(cwd, {
      main: 'out/lib.cjs.js',
      module: 'out/lib.es.js',
      browser: 'out/lib.umd.js',
      bin: 'out/lib.bin.js',
    });

    expect(main ? main.sourcemap : null).toBe(true);
    expect(moduleOut ? moduleOut.sourcemap : null).toBe(true);
    expect(browser ? browser.sourcemap : null).toBe(true);
    expect(bin ? bin.sourcemap : null).toBe(true);

  });

  test('should read per-build sourcemap option over top-level one', async () => {

    const { main, module: moduleOut, browser, bin } = await analize(cwd, {
      main: 'out/lib.cjs.js',
      module: 'out/lib.es.js',
      browser: 'out/lib.umd.js',
      bin: 'out/lib.bin.js',
      bundlib: {
        sourcemap: false,
        main: { sourcemap: 'inline' },
        module: { sourcemap: 'inline' },
        browser: { sourcemap: 'inline' },
        bin: { sourcemap: 'inline' },
      },
    });

    expect(main ? main.sourcemap : null).toBe('inline');
    expect(moduleOut ? moduleOut.sourcemap : null).toBe('inline');
    expect(browser ? browser.sourcemap : null).toBe('inline');
    expect(bin ? bin.sourcemap : null).toBe('inline');

  });

});
