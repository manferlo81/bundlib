import analyze from '../tools/analyze';

describe('id option', () => {

  const cwd = process.cwd();

  test('should throw on invalid id option', () => {

    const invalidIdOptions = [
      1,
      true,
      false,
    ];

    expect.assertions(invalidIdOptions.length);

    invalidIdOptions.forEach((id) => {
      void expect(analyze(cwd, { bundlib: { id: id as never } })).rejects.toThrow(TypeError);
    });

  });

  test('should set browser build amd id', async () => {

    const id = 'libId';

    const { browser } = await analyze(cwd, {
      browser: 'out/lib.umd.js',
      bundlib: { name: 'lib', id },
    });

    expect(browser ? browser.id : null).toBe(id);

  });

  test('should default to null if no browser build amd id provided', async () => {

    const { browser } = await analyze(cwd, {
      browser: 'out/lib.umd.js',
      bundlib: { name: 'lib' },
    });

    expect(browser ? browser.id : false).toBeNull();

  });

  test('should read per-build id option over top-level one', async () => {

    const { browser } = await analyze(cwd, {
      browser: 'browser.js',
      bundlib: {
        id: 'top-level',
        browser: { id: 'per-build' },
      },
    });

    expect(browser ? browser.id : null).toBe('per-build');

  });

});
