import { filenameColor, javascriptValueColor, packageFieldColor } from '../tools/colors';
import { mockAnalyzeWithPkgEmptyConfig } from '../tools/mock-fs';

describe(`${filenameColor('package.json')} ${packageFieldColor('"browser"')} field`, () => {

  const cwd = process.cwd();

  const mockAnalyzeWithBrowserField = (browser: string) => {
    return mockAnalyzeWithPkgEmptyConfig(cwd, { browser });
  };

  test(`Should ${javascriptValueColor('throw')} on invalid ${packageFieldColor('"browser"')} field`, () => {

    const invalidBrowserPaths = [
      1,
      { name: 'value' },
    ];

    invalidBrowserPaths.forEach((invalid) => {
      void expect(mockAnalyzeWithBrowserField(invalid as never)).rejects.toThrow(TypeError);
    });

  });

  test(`Should read ${packageFieldColor('"browser"')} field`, async () => {

    const browserField = 'browser.js';
    const analyzed = await mockAnalyzeWithBrowserField(browserField);
    const { browser } = analyzed;

    expect(browser).not.toBeNull();
    expect(browser?.output).toBe(browserField);

  });

});
