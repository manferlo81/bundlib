import analize from '../tools/analize';

describe('package.json browser field', () => {

  const cwd = process.cwd();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analizeWithBrowser = (browser: any) => analize(cwd, { browser });

  test('should throw on invalid browser field', () => {

    const invalidBrowserPaths = [
      1,
      { name: 'value' },
    ];

    expect.assertions(invalidBrowserPaths.length);

    invalidBrowserPaths.forEach((browser) => {
      expect(
        analizeWithBrowser(browser),
      ).rejects
        .toThrow(TypeError);
    });

  });

  test('should read browser field', async () => {

    const browserField = 'out/lib.js';
    const analized = await analizeWithBrowser(browserField);
    const { browser } = analized;

    expect(browser ? browser.output : null).toBe(browserField);

  });

});
