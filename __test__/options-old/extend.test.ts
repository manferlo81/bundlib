import analize from '../tools/analize';

describe('extend option', () => {

  const cwd = process.cwd();

  const analizeWithExtend = (extend: boolean | null) => analize(cwd, {
    browser: 'out/lib.js',
    bundlib: { extend },
  });

  const analizeWithBuildExtend = (extend: boolean | null) => analize(cwd, {
    browser: 'out/lib.js',
    bundlib: { extend: !extend, browser: { extend } },
  });

  test('should read truthy extend option and set as boolean', async () => {
    const { browser } = await analizeWithExtend(1 as never);
    expect(browser ? browser.extend : null).toBe(true);
  });

  test('should read falsy extend option and set as boolean', async () => {
    const { browser } = await analizeWithExtend(0 as never);
    expect(browser ? browser.extend : null).toBe(false);
  });

  test('should read true extend option and set as boolean', async () => {
    const { browser } = await analizeWithExtend(true);
    expect(browser ? browser.extend : null).toBe(true);
  });

  test('should read false extend option and set as boolean', async () => {
    const { browser } = await analizeWithExtend(false);
    expect(browser ? browser.extend : null).toBe(false);
  });

  test('should read truthy per-build extend option and set as boolean', async () => {
    const { browser } = await analizeWithBuildExtend(1 as never);
    expect(browser ? browser.extend : null).toBe(true);
  });

  test('should read falsy per-build extend option and set as boolean', async () => {
    const { browser } = await analizeWithBuildExtend(0 as never);
    expect(browser ? browser.extend : null).toBe(false);
  });

  test('should read true per-build extend option and set as boolean', async () => {
    const { browser } = await analizeWithBuildExtend(true);
    expect(browser ? browser.extend : null).toBe(true);
  });

  test('should read false per-build extend option and set as boolean', async () => {
    const { browser } = await analizeWithBuildExtend(false);
    expect(browser ? browser.extend : null).toBe(false);
  });

  test('should read per-build extend option over top-level one', async () => {
    const { browser } = await analize(cwd, {
      browser: 'browser',
      bundlib: { extend: true, browser: { extend: false } },
    });
    expect(browser ? browser.extend : null).toBe(false);
  });

});
