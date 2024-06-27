import { type BrowserBuildFormat } from '../../src/api';
import { mockAnalyzeWithPkg } from '../tools/mock-fs';

describe('"format" option', () => {

  const cwd = process.cwd();

  const analyzeWithFormatOption = (format: BrowserBuildFormat) => mockAnalyzeWithPkg(cwd, {
    browser: 'browser.js',
    bundlib: { format },
  });

  test('Should throw on invalid "format" option', () => {

    const invalidBrowserFormats = [
      1,
      'string',
    ];

    invalidBrowserFormats.forEach((format) => {
      void expect(analyzeWithFormatOption(format as never)).rejects.toThrow('Invalid "format" option');
    });

  });

  test('Should set browser format to "iife"', async () => {
    const format = 'iife';
    const { browser } = await analyzeWithFormatOption(format);
    expect(browser?.format).toBe(format);
  });

  test('Should set browser format to "amd"', async () => {
    const format = 'amd';
    const { browser } = await analyzeWithFormatOption(format);
    expect(browser?.format).toBe(format);
  });

  test('Should set browser format to "umd"', async () => {
    const format = 'umd';
    const { browser } = await analyzeWithFormatOption(format);
    expect(browser?.format).toBe(format);
  });

  test('Should default to "umd" in no "format" option present', async () => {
    const { browser } = await mockAnalyzeWithPkg(cwd, {
      browser: 'browser.js',
    });
    expect(browser?.format).toBe('umd');
  });

});
