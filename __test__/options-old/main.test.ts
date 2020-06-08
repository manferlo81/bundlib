import analize from '../tools/analize';

describe('main option', () => {

  const cwd = process.cwd();

  const analizeWithMain = (main: never) => analize(cwd, {
    main: 'out.js',
    bundlib: { main },
  });

  test('should throw on invalid main option', () => {

    const invalidMain = [
      1,
      true,
      { invalid: true },
      { api: 10, bin: 11 },
    ];

    expect.assertions(invalidMain.length);

    invalidMain.forEach((main) => {
      void expect(analizeWithMain(main as never)).rejects.toThrow(TypeError);
    });

  });

  test('should prevent CommonJS module build if main = false', async () => {
    const { main } = await analizeWithMain(false as never);
    expect(main).toBeNull();
  });

});
