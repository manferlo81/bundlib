import analize from '../tools/analize';

describe('package.json bundlib field', () => {

  const cwd = process.cwd();

  test('should throw on invalid bundlib field', () => {

    const invalidBundlibOptions = [
      1,
      [],
    ];

    expect.assertions(invalidBundlibOptions.length);

    invalidBundlibOptions.forEach((bundlib) => {
      void expect(analize(cwd, { bundlib: bundlib as never })).rejects.toThrow(TypeError);
    });

  });

  test('should use bundlib option as object', async () => {

    const name = 'name';
    const { browser } = await analize(cwd, { browser: 'out.js', bundlib: { name } });

    expect(browser).toMatchObject({ name });

  });

  test('should use bundlib option as string', async () => {

    const name = 'bundlib';
    const { browser } = await analize(cwd, { browser: 'out.js', bundlib: 'bundlib.json' });

    expect(browser).toMatchObject({ name });

  });

});
