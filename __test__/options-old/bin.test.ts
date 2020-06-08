import analize from '../tools/analize';

describe('bin option', () => {

  const cwd = process.cwd();

  const analizeWithBin = (bin: never) => analize(cwd, {
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
      void expect(analizeWithBin(bin as never)).rejects.toThrow(TypeError);
    });

  });

  test('should prevent Binary module build if bin = false', async () => {
    const { bin } = await analizeWithBin(false as never);
    expect(bin).toBeNull();
  });

});
