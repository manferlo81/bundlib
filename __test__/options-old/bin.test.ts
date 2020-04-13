import analize from '../tools/analize';

describe('bin option', () => {

  const cwd = process.cwd();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analizeWithBin = (bin: any) => analize(cwd, {
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
      expect(analizeWithBin(bin)).rejects.toThrow(TypeError);
    });

  });

  test('should prevent Binary module build if bin = false', async () => {
    const { bin } = await analizeWithBin(false);
    expect(bin).toBeNull();
  });

});
