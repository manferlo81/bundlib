import type { RollupSourcemap } from '../../src/api';
import { colorizeMessage } from '../tools/colors';
import { mockAnalyzeWithPkg } from '../tools/mock-fs';

describe(colorizeMessage('"sourcemap" option'), () => {

  const cwd = process.cwd();

  const analyzeWithSourcemap = (sourcemap: RollupSourcemap) => mockAnalyzeWithPkg(cwd, {
    main: 'out/lib.cjs.js',
    module: 'out/lib.es.js',
    browser: 'out/lib.umd.js',
    bin: 'out/lib.bin.js',
    bundlib: { sourcemap },
  });

  test(colorizeMessage('Should throw on invalid "sourcemap" option'), () => {

    const invalidSourcemaps = [
      100,
      'string',
    ];

    invalidSourcemaps.forEach((sourcemap) => {
      void expect(analyzeWithSourcemap(sourcemap as never)).rejects.toThrow('Invalid "sourcemap" option');
    });

  });

  test(colorizeMessage('Should read "sourcemap" option'), async () => {

    const { main, module: esnext, browser, bin } = await analyzeWithSourcemap(false);

    expect(main?.sourcemap).toBe(false);
    expect(esnext?.sourcemap).toBe(false);
    expect(browser?.sourcemap).toBe(false);
    expect(bin?.sourcemap).toBe(false);

  });

  test(colorizeMessage('Should read "inline" as "sourcemap" option'), async () => {

    const sourcemap = 'inline';
    const { main, module: moduleOut, browser, bin } = await analyzeWithSourcemap(sourcemap);

    expect(main?.sourcemap).toBe(sourcemap);
    expect(moduleOut?.sourcemap).toBe(sourcemap);
    expect(browser?.sourcemap).toBe(sourcemap);
    expect(bin?.sourcemap).toBe(sourcemap);

  });

  test(colorizeMessage('Should read "hidden" as "sourcemap" option'), async () => {

    const sourcemap = 'hidden';
    const { main, module: moduleOut, browser, bin } = await analyzeWithSourcemap(sourcemap);

    expect(main?.sourcemap).toBe(sourcemap);
    expect(moduleOut?.sourcemap).toBe(sourcemap);
    expect(browser?.sourcemap).toBe(sourcemap);
    expect(bin?.sourcemap).toBe(sourcemap);

  });

  test(colorizeMessage('Should default to true if no "sourcemap" option present'), async () => {

    const { main, module: moduleOut, browser, bin } = await mockAnalyzeWithPkg(cwd, {
      main: 'out/lib.cjs.js',
      module: 'out/lib.es.js',
      browser: 'out/lib.umd.js',
      bin: 'out/lib.bin.js',
    });

    expect(main?.sourcemap).toBe(true);
    expect(moduleOut?.sourcemap).toBe(true);
    expect(browser?.sourcemap).toBe(true);
    expect(bin?.sourcemap).toBe(true);

  });

});
