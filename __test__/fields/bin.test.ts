import analize from '../tools/analize';

describe('package.json bin field', () => {

  const cwd = process.cwd();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analizeWithBin = (bin: any) => analize(cwd, { bin });

  test('should throw on invalid bin field', () => {

    const invalidBrowserPaths = [
      1,
      { name: 'value' },
    ];

    expect.assertions(invalidBrowserPaths.length);

    invalidBrowserPaths.forEach((bin) => {
      expect(
        analizeWithBin(bin),
      ).rejects
        .toThrow(TypeError);
    });

  });

  test('should read binary output filename', async () => {

    const binField = 'bin/cli.js';
    const analized = await analizeWithBin(binField);
    const { bin } = analized;

    expect(bin ? bin.path : null).toBe(binField);

  });

});
