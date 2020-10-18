import analyze from '../tools/analyze';

describe('package.json browser field', () => {

  const cwd = process.cwd();

  const analyzeWithBrowser = (browser: string) => analyze(cwd, { browser });

  test('should throw on invalid browser field', () => {

    const invalidBrowserPaths = [
      1,
      { name: 'value' },
    ];

    expect.assertions(invalidBrowserPaths.length);

    invalidBrowserPaths.forEach((browser) => {
      void expect(analyzeWithBrowser(browser as never)).rejects.toThrow(TypeError);
    });

  });

  test('should read browser field', async () => {

    const browserField = 'out/lib.js';
    const analyzed = await analyzeWithBrowser(browserField);
    const { browser } = analyzed;

    expect(browser ? browser.output : null).toBe(browserField);

  });

});
