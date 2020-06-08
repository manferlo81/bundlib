import analize from '../tools/analize';

describe('package.json browser field', () => {

  const cwd = process.cwd();

  const analizeWithBrowser = (browser: string) => analize(cwd, { browser });

  test('should throw on invalid browser field', () => {

    const invalidBrowserPaths = [
      1,
      { name: 'value' },
    ];

    expect.assertions(invalidBrowserPaths.length);

    invalidBrowserPaths.forEach((browser) => {
      void expect(analizeWithBrowser(browser as never)).rejects.toThrow(TypeError);
    });

  });

  test('should read browser field', async () => {

    const browserField = 'out/lib.js';
    const analized = await analizeWithBrowser(browserField);
    const { browser } = analized;

    expect(browser ? browser.output : null).toBe(browserField);

  });

});
