import analyze from '../tools/analyze';

describe('types option', () => {

  const cwd = process.cwd();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analyzeWithMain = (types: never) => analyze(cwd, {
    types: 'out.js',
    bundlib: { types },
  });

  test('should throw on invalid types option', () => {

    const invalidMain = [
      1,
      true,
      { invalid: true },
      { api: 10, bin: 11 },
    ];

    expect.assertions(invalidMain.length);

    invalidMain.forEach((types) => {
      void expect(analyzeWithMain(types as never)).rejects.toThrow(TypeError);
    });

  });

  test('should prevent types generation if types = false', async () => {
    const { types } = await analyzeWithMain(false as never);
    expect(types).toBeNull();
  });

});
