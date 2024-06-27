import { RollupSourcemap } from '../../src/api';
import { mockAnalyzeWithPkg } from '../tools/mock-fs';

describe('sourcemap option', () => {

  const cwd = process.cwd();

  const analyzeWithBuildSourcemap = (field: string, sourcemap: RollupSourcemap) => mockAnalyzeWithPkg(cwd, {
    main: 'out/lib.cjs.js',
    module: 'out/lib.es.js',
    browser: 'out/lib.umd.js',
    bin: 'out/lib.bin.js',
    bundlib: { [field]: { sourcemap } },
  });

  test('Should read build "sourcemap" option', async () => {

    const { main, module: moduleOut, browser, bin } = await analyzeWithBuildSourcemap('main', false);

    expect(main?.sourcemap).toBe(false);
    expect(moduleOut?.sourcemap).toBe(true);
    expect(browser?.sourcemap).toBe(true);
    expect(bin?.sourcemap).toBe(true);

  });

  test('Should read build "inline" as "sourcemap" option', async () => {

    const { main, module: moduleOut, browser, bin } = await analyzeWithBuildSourcemap('module', 'inline');

    expect(main?.sourcemap).toBe(true);
    expect(moduleOut?.sourcemap).toBe('inline');
    expect(browser?.sourcemap).toBe(true);
    expect(bin?.sourcemap).toBe(true);

  });

  test('Should read per-build sourcemap option over top-level one', async () => {

    const { main, module: esnext, browser, bin } = await mockAnalyzeWithPkg(cwd, {
      main: 'out/lib.cjs.js',
      module: 'out/lib.es.js',
      browser: 'out/lib.umd.js',
      bin: 'out/lib.bin.js',
      bundlib: {
        sourcemap: false,
        main: { sourcemap: 'inline' },
        module: { sourcemap: 'hidden' },
        browser: { sourcemap: true },
        bin: { sourcemap: false },
      },
    });

    expect(main?.sourcemap).toBe('inline');
    expect(esnext?.sourcemap).toBe('hidden');
    expect(browser?.sourcemap).toBe(true);
    expect(bin?.sourcemap).toBe(false);

  });

});
