import type { BrowserBuildFormat } from '../../src/api';
import analyze from '../tools/analyze';

describe('format option', () => {

  const cwd = process.cwd();

  const analyzeWithFormat = (format: BrowserBuildFormat) => analyze(cwd, {
    browser: 'out/lib.js',
    bundlib: { format },
  });

  const analyzeWithBuildFormat = (format: BrowserBuildFormat) => analyze(cwd, {
    browser: 'out/lib.js',
    bundlib: { browser: { format } },
  });

  test('should throw on invalid format option', () => {

    const invalidBrowserFormats = [
      1,
      'string',
    ];

    expect.assertions(invalidBrowserFormats.length);

    invalidBrowserFormats.forEach((format) => {
      void expect(analyzeWithFormat(format as never)).rejects.toThrow(TypeError);
    });

  });

  test('should set browser format to iife', async () => {
    const format = 'iife';
    const { browser } = await analyzeWithFormat(format);
    expect(browser ? browser.format : null).toBe(format);
  });

  test('should set browser format to amd', async () => {
    const format = 'amd';
    const { browser } = await analyzeWithFormat(format);
    expect(browser ? browser.format : null).toBe(format);
  });

  test('should set browser format to umd', async () => {
    const format = 'umd';
    const { browser } = await analyzeWithFormat(format);
    expect(browser ? browser.format : null).toBe(format);
  });

  test('should set browser format to iife from build', async () => {
    const format = 'iife';
    const { browser } = await analyzeWithBuildFormat(format);
    expect(browser ? browser.format : null).toBe(format);
  });

  test('should set browser format to amd from build', async () => {
    const format = 'amd';
    const { browser } = await analyzeWithBuildFormat(format);
    expect(browser ? browser.format : null).toBe(format);
  });

  test('should set browser format to umd from build', async () => {
    const format = 'umd';
    const { browser } = await analyzeWithBuildFormat(format);
    expect(browser ? browser.format : null).toBe(format);
  });

  test('should default to umd in no browser format provided', async () => {
    const { browser } = await analyze(cwd, { browser: 'out/lib.js' });
    expect(browser ? browser.format : null).toBe('umd');
  });

  test('should read per-build browser format over top-level one', async () => {
    const { browser } = await analyze(cwd, {
      browser: 'out/lib.js',
      bundlib: {
        format: 'amd',
        browser: { format: 'iife' },
      },
    });
    expect(browser ? browser.format : null).toBe('iife');
  });

});
