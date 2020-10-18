import analyze from '../tools/analyze';

describe('bin option', () => {

  const cwd = process.cwd();

  const analyzeWithBin = (bin: never) => analyze(cwd, {
    bin: 'out.js',
    bundlib: { bin },
  });

  test('should throw on invalid bin option', () => {

    const invalidInputs = [
      1,
      true,
      { invalid: 100 },
    ];

    expect.assertions(invalidInputs.length);

    invalidInputs.forEach((bin) => {
      void expect(analyzeWithBin(bin as never)).rejects.toThrow(TypeError);
    });

  });

  test('should prevent Binary module build if bin = false', async () => {
    const { bin } = await analyzeWithBin(false as never);
    expect(bin).toBeNull();
  });

});
