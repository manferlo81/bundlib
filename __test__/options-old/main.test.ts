import analize from '../tools/analize';

describe('main option', () => {

  const cwd = process.cwd();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analizeWithMain = (main: any) => analize(cwd, {
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
      expect(
        analizeWithMain(main),
      ).rejects
        .toThrow(TypeError);
    });

  });

  test('should prevent CommonJS module build if main = false', async () => {
    const { main } = await analizeWithMain(false);
    expect(main).toBeNull();
  });

});
