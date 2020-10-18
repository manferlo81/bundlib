import analyze from '../tools/analyze';

describe('name option', () => {

  const cwd = process.cwd();

  test('should throw on invalid name option', () => {

    const invalidNameOptions = [
      1,
      true,
      false,
    ];

    expect.assertions(invalidNameOptions.length);

    invalidNameOptions.forEach((name) => {
      void expect(analyze(cwd, { bundlib: { name: name as never } })).rejects.toThrow(TypeError);
    });

  });

  test('should set browser build name', async () => {

    const name = 'pkg-name';

    const { browser } = await analyze(cwd, {
      name,
      browser: 'out/lib.umd.js',
      bundlib: { name },
    });

    expect(browser ? browser.name : null).toBe(name);

  });

  test('should default to camelcased, unscoped package name if no name option provided', async () => {

    const pkgName = '@scope/pkg-name';

    const { browser } = await analyze(cwd, {
      name: pkgName,
      browser: 'out/lib.umd.js',
    });

    expect(browser ? browser.name : null).toBe('pkgName');

  });

  test('should read per-build name option over top-level one', async () => {

    const { browser } = await analyze(cwd, {
      browser: 'browser.js',
      bundlib: {
        name: 'top-level',
        browser: { name: 'per-build' },
      },
    });

    expect(browser ? browser.name : null).toBe('per-build');

  });

});
