import { DeprecatedModuleOption } from '../../src/api';
import { mockAnalyzeWithPkg } from '../tools/mock-fs';

describe('deprecated per-build "esModule" option', () => {

  const cwd = process.cwd();

  const analyzeWithBuildESModule = (field: string, esModule: DeprecatedModuleOption | true) => mockAnalyzeWithPkg(cwd, {
    main: 'main.js',
    browser: 'browser.js',
    bin: 'bin.js',
    bundlib: { esModule: !esModule, [field]: { esModule } },
  });

  test('Should read per-build main "esModule" option', async () => {

    const { main, browser, bin } = await analyzeWithBuildESModule('main', true);

    expect(main?.esModule).toBe(true);
    expect(browser?.esModule).toBe(false);
    expect(bin?.esModule).toBe(false);

  });

  test('Should read per-build browser "esModule" option', async () => {

    const { main, browser, bin } = await analyzeWithBuildESModule('browser', true);

    expect(main?.esModule).toBe(false);
    expect(browser?.esModule).toBe(true);
    expect(bin?.esModule).toBe(false);

  });

  test('Should read per-build bin "esModule" option', async () => {

    const { main, browser, bin } = await analyzeWithBuildESModule('bin', true);

    expect(main?.esModule).toBe(false);
    expect(browser?.esModule).toBe(false);
    expect(bin?.esModule).toBe(true);

  });

  test('Should read per-build esModule option over top-level one', async () => {

    const { main, browser, bin } = await mockAnalyzeWithPkg(cwd, {
      main: 'main.js',
      browser: 'browser.js',
      bin: 'binary.js',
      bundlib: {
        esModule: true,
        main: { esModule: false },
        browser: { esModule: false },
        bin: { esModule: false },
      },
    });

    expect(main?.esModule).toBe(false);
    expect(browser?.esModule).toBe(false);
    expect(bin?.esModule).toBe(false);

  });

});
