import { mockAnalyzeWithPkg } from '../tools/mock-fs';

describe('deprecated browser "globals" option', () => {

  const cwd = process.cwd();

  const analyzeWithBuildGlobals = (globals: Record<string, string> | string[] | null) => mockAnalyzeWithPkg(cwd, {
    browser: 'browser.js',
    bundlib: { browser: { globals } },
  });

  test('Should throw on invalid per-build "globals" option', () => {

    const invalidGlobalsOptions = [
      1,
      true,
      false,
    ];

    invalidGlobalsOptions.forEach((globals) => {
      void expect(() => analyzeWithBuildGlobals(globals as never)).rejects.toThrow('Invalid "browser" option');
    });

  });

  test('Should work with array per-build globals option', async () => {

    const { browser } = await analyzeWithBuildGlobals(['module1', 'module2']);

    expect(browser ? browser.globals : null)
      .toEqual({
        module1: 'module1',
        module2: 'module2',
      });

  });

  test('Should work with object per-build globals option', async () => {

    const globals = {
      module1: 'mod1',
      module2: 'mod2',
    };

    const { browser } = await analyzeWithBuildGlobals(globals);

    expect(browser ? browser.globals : null)
      .toEqual(globals);

  });

  test('Should set globals to null if per-build globals option null', async () => {

    const { browser } = await analyzeWithBuildGlobals(null);

    expect(browser ? browser.globals : false)
      .toBeNull();

  });

  test('Should set globals to null if no globals option set', async () => {

    const { browser } = await mockAnalyzeWithPkg(cwd, {
      browser: 'browser.js',
      bundlib: {},
    });

    expect(browser ? browser.globals : false)
      .toBeNull();

  });

  test('Should set per-build globals option over top-level one', async () => {

    const { browser } = await mockAnalyzeWithPkg(cwd, {
      browser: 'browser.js',
      bundlib: {
        globals: ['top-level'],
        browser: { globals: ['per-build'] },
      },
    });

    expect(browser ? browser.globals : false)
      .toEqual({ 'per-build': 'per-build' });

  });

});
