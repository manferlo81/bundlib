import { DeprecatedBrowserOption } from '../../src/api';
import { mockAnalyzeWithPkg } from '../tools/mock-fs';

describe('deprecated "browser" option', () => {

  const cwd = process.cwd();

  const analyzeWithBrowser = (browser: DeprecatedBrowserOption) => mockAnalyzeWithPkg(cwd, {
    browser: 'browser.js',
    bundlib: { browser },
  });

  test('Should throw on invalid "browser" option', () => {

    const invalidBrowser = [
      1,
      true,
      { invalid: true },
      { format: 'fmt' },
      { name: 1 },
      { id: 1 },
      { globals: 'invalid' },
    ];

    invalidBrowser.forEach((browser) => {
      void expect(() => analyzeWithBrowser(browser as never)).rejects.toThrow('Invalid "browser" option');
    });

  });

  test('Should prevent Browser module build if "browser" options is false', async () => {
    const { browser } = await analyzeWithBrowser(false as never);
    expect(browser).toBeNull();
  });

});
