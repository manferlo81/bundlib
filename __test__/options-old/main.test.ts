import analyze from '../tools/analyze';

describe('main option', () => {

  const cwd = process.cwd();

  const analyzeWithMain = (main: never) => analyze(cwd, {
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
      void expect(analyzeWithMain(main as never)).rejects.toThrow(TypeError);
    });

  });

  test('should prevent CommonJS module build if main = false', async () => {
    const { main } = await analyzeWithMain(false as never);
    expect(main).toBeNull();
  });

});
