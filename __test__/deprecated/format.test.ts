import { type BrowserBuildFormat } from '../../src/api';
import { mockAnalyzeWithPkg } from '../tools/mock-fs';

describe('deprecated browser "format" option', () => {

  const cwd = process.cwd();

  const analyzeWithBuildFormat = (format: BrowserBuildFormat) => mockAnalyzeWithPkg(cwd, {
    browser: 'out/lib.js',
    bundlib: { browser: { format } },
  });

  test('Should set browser format to "iife"', async () => {
    const format = 'iife';
    const { browser } = await analyzeWithBuildFormat(format);
    expect(browser?.format).toBe(format);
  });

  test('Should set browser format to "amd"', async () => {
    const format = 'amd';
    const { browser } = await analyzeWithBuildFormat(format);
    expect(browser?.format).toBe(format);
  });

  test('Should set browser format to "umd"', async () => {
    const format = 'umd';
    const { browser } = await analyzeWithBuildFormat(format);
    expect(browser?.format).toBe(format);
  });

  test('Should default to "umd" in no "format" option present', async () => {
    const { browser } = await mockAnalyzeWithPkg(cwd, {
      browser: 'browser.js',
    });
    expect(browser?.format).toBe('umd');
  });

  test('Should read per-build browser format over top-level one', async () => {
    const { browser } = await mockAnalyzeWithPkg(cwd, {
      browser: 'browser.js',
      bundlib: {
        format: 'amd',
        browser: { format: 'iife' },
      },
    });
    expect(browser?.format).toBe('iife');
  });

});
