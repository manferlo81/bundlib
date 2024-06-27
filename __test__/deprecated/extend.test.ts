import { mockAnalyzeWithPkg } from '../tools/mock-fs';

describe('deprecated per-build "extend" option', () => {

  const cwd = process.cwd();

  const analyzeWithBuildExtend = (extend: boolean | null) => mockAnalyzeWithPkg(cwd, {
    browser: 'out/lib.js',
    bundlib: { extend: !extend, browser: { extend } },
  });

  test('Should read truthy per-build extend option and set as boolean', async () => {
    const { browser } = await analyzeWithBuildExtend(1 as never);
    expect(browser?.extend).toBe(true);
  });

  test('Should read falsy per-build extend option and set as boolean', async () => {
    const { browser } = await analyzeWithBuildExtend(0 as never);
    expect(browser?.extend).toBe(false);
  });

  test('Should read true per-build extend option and set as boolean', async () => {
    const { browser } = await analyzeWithBuildExtend(true);
    expect(browser?.extend).toBe(true);
  });

  test('Should read false per-build extend option and set as boolean', async () => {
    const { browser } = await analyzeWithBuildExtend(false);
    expect(browser?.extend).toBe(false);
  });

  test('Should read per-build extend option over top-level one', async () => {
    const { browser } = await mockAnalyzeWithPkg(cwd, {
      browser: 'browser',
      bundlib: { extend: true, browser: { extend: false } },
    });
    expect(browser?.extend).toBe(false);
  });

});
