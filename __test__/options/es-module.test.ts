import type { SelectiveEsModuleOption } from '../../src/api/types/bundlib-options';
import { mockAnalyzeWithPkg, mockAnalyzeWithPkgEmptyConfig } from '../tools/mock-fs';

describe('"esModule" option', () => {

  const cwd = process.cwd();

  const analyzeWithESModuleOption = (esModule: SelectiveEsModuleOption) => mockAnalyzeWithPkg(cwd, {
    main: 'main.js',
    browser: 'browser.js',
    bin: 'bin.js',
    bundlib: { esModule },
  });

  test('Should throw on invalid "esModule" option', () => {

    const invalid = [
      1,
      'main-',
      'browser-',
      'bin-',
      ['main-'],
      ['main', 'browser-'],
    ];

    invalid.forEach((esModule) => {
      void expect(analyzeWithESModuleOption(esModule as never)).rejects.toThrow('Invalid "esModule" option');
    });

  });

  test('Should read string main "esModule" option', async () => {

    const { main, browser, bin } = await analyzeWithESModuleOption('main');

    expect(main?.esModule).toBe(true);
    expect(browser?.esModule).toBe(false);
    expect(bin?.esModule).toBe(false);

  });

  test('Should read string browser "esModule" option', async () => {

    const { main, browser, bin } = await analyzeWithESModuleOption('browser');

    expect(main?.esModule).toBe(false);
    expect(browser?.esModule).toBe(true);
    expect(bin?.esModule).toBe(false);

  });

  test('Should read string bin "esModule" option', async () => {

    const { main, browser, bin } = await analyzeWithESModuleOption('bin');

    expect(main?.esModule).toBe(false);
    expect(browser?.esModule).toBe(false);
    expect(bin?.esModule).toBe(true);

  });

  test('Should read array "esModule" option', async () => {

    const { main, browser, bin } = await analyzeWithESModuleOption(['main', 'bin']);

    expect(main?.esModule).toBe(true);
    expect(browser?.esModule).toBe(false);
    expect(bin?.esModule).toBe(true);

  });

  test('Should read true as "esModule" option', async () => {

    const { main, browser, bin } = await analyzeWithESModuleOption(true);

    expect(main?.esModule).toBe(true);
    expect(browser?.esModule).toBe(true);
    expect(bin?.esModule).toBe(true);

  });

  test('Should read false as "esModule" option', async () => {

    const { main, browser, bin } = await analyzeWithESModuleOption(false);

    expect(main?.esModule).toBe(false);
    expect(browser?.esModule).toBe(false);
    expect(bin?.esModule).toBe(false);

  });

  test('Should read esModule string as "esModule" option', async () => {

    const value = 'if-default-prop';
    const { main, browser, bin } = await analyzeWithESModuleOption(value);

    expect(main?.esModule).toBe(value);
    expect(browser?.esModule).toBe(value);
    expect(bin?.esModule).toBe(value);

  });

  test('Should default to false if "esModule" option not present', async () => {

    const { main, browser, bin } = await mockAnalyzeWithPkgEmptyConfig(cwd, {
      main: 'out/lib.cjs.js',
      browser: 'out/lib.umd.js',
      bin: 'out/lib.bin.js',
    });

    expect(main?.esModule).toBe(false);
    expect(browser?.esModule).toBe(false);
    expect(bin?.esModule).toBe(false);

  });

});
