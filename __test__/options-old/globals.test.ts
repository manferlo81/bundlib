import analize from '../tools/analize';

describe('globals option', () => {

  const cwd = process.cwd();

  const analizeWithGlobals = (globals: Record<string, string> | string[] | null) => analize(cwd, {
    browser: 'browser.js',
    bundlib: { globals },
  });

  const analizeWithBuildGlobals = (globals: Record<string, string> | string[] | null) => analize(cwd, {
    browser: 'browser.js',
    bundlib: { browser: { globals } },
  });

  test('should throw on invalid globals option', () => {

    const invalidGlobalsOptions = [
      1,
      true,
      false,
    ];

    expect.assertions(invalidGlobalsOptions.length);

    invalidGlobalsOptions.forEach((globals) => {
      void expect(analizeWithGlobals(globals as never)).rejects.toThrow(TypeError);
    });

  });

  test('should throw on invalid per-build globals option', () => {

    const invalidGlobalsOptions = [
      1,
      true,
      false,
    ];

    expect.assertions(invalidGlobalsOptions.length);

    invalidGlobalsOptions.forEach((globals) => {
      void expect(analizeWithBuildGlobals(globals as never)).rejects.toThrow(TypeError);
    });

  });

  test('should work with array globals option', async () => {

    const { browser } = await analizeWithGlobals(['module1', 'module2']);

    expect(browser ? browser.globals : null)
      .toEqual({
        module1: 'module1',
        module2: 'module2',
      });

  });

  test('should work with array per-build globals option', async () => {

    const { browser } = await analizeWithBuildGlobals(['module1', 'module2']);

    expect(browser ? browser.globals : null)
      .toEqual({
        module1: 'module1',
        module2: 'module2',
      });

  });

  test('should work with object globals option', async () => {

    const globals = {
      module1: 'mod1',
      module2: 'mod2',
    };

    const { browser } = await analizeWithGlobals(globals);

    expect(browser ? browser.globals : null)
      .toEqual(globals);

  });

  test('should work with object per-build globals option', async () => {

    const globals = {
      module1: 'mod1',
      module2: 'mod2',
    };

    const { browser } = await analizeWithBuildGlobals(globals);

    expect(browser ? browser.globals : null)
      .toEqual(globals);

  });

  test('should set globals to null if globals option null', async () => {

    const { browser } = await analizeWithGlobals(null);

    expect(browser ? browser.globals : false)
      .toBeNull();

  });

  test('should set globals to null if per-build globals option null', async () => {

    const { browser } = await analizeWithBuildGlobals(null);

    expect(browser ? browser.globals : false)
      .toBeNull();

  });

  test('should set globals to null if no globals option set', async () => {

    const { browser } = await analize(cwd, {
      browser: 'browser.js',
      bundlib: {},
    });

    expect(browser ? browser.globals : false)
      .toBeNull();

  });

  test('should set per-build globals option over top-level one', async () => {

    const { browser } = await analize(cwd, {
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
