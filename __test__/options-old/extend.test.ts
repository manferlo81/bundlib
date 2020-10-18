import analyze from '../tools/analyze';

describe('extend option', () => {

  const cwd = process.cwd();

  const analyzeWithExtend = (extend: boolean | null) => analyze(cwd, {
    browser: 'out/lib.js',
    bundlib: { extend },
  });

  const analyzeWithBuildExtend = (extend: boolean | null) => analyze(cwd, {
    browser: 'out/lib.js',
    bundlib: { extend: !extend, browser: { extend } },
  });

  test('should read truthy extend option and set as boolean', async () => {
    const { browser } = await analyzeWithExtend(1 as never);
    expect(browser ? browser.extend : null).toBe(true);
  });

  test('should read falsy extend option and set as boolean', async () => {
    const { browser } = await analyzeWithExtend(0 as never);
    expect(browser ? browser.extend : null).toBe(false);
  });

  test('should read true extend option and set as boolean', async () => {
    const { browser } = await analyzeWithExtend(true);
    expect(browser ? browser.extend : null).toBe(true);
  });

  test('should read false extend option and set as boolean', async () => {
    const { browser } = await analyzeWithExtend(false);
    expect(browser ? browser.extend : null).toBe(false);
  });

  test('should read truthy per-build extend option and set as boolean', async () => {
    const { browser } = await analyzeWithBuildExtend(1 as never);
    expect(browser ? browser.extend : null).toBe(true);
  });

  test('should read falsy per-build extend option and set as boolean', async () => {
    const { browser } = await analyzeWithBuildExtend(0 as never);
    expect(browser ? browser.extend : null).toBe(false);
  });

  test('should read true per-build extend option and set as boolean', async () => {
    const { browser } = await analyzeWithBuildExtend(true);
    expect(browser ? browser.extend : null).toBe(true);
  });

  test('should read false per-build extend option and set as boolean', async () => {
    const { browser } = await analyzeWithBuildExtend(false);
    expect(browser ? browser.extend : null).toBe(false);
  });

  test('should read per-build extend option over top-level one', async () => {
    const { browser } = await analyze(cwd, {
      browser: 'browser',
      bundlib: { extend: true, browser: { extend: false } },
    });
    expect(browser ? browser.extend : null).toBe(false);
  });

});
