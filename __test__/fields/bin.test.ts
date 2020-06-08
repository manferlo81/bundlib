import analize from '../tools/analize';

describe('package.json bin field', () => {

  const cwd = process.cwd();

  const analizeWithBin = (bin: string) => analize(cwd, { bin });

  test('should throw on invalid bin field', () => {

    const invalidBrowserPaths = [
      1,
      { name: 'value' },
    ];

    expect.assertions(invalidBrowserPaths.length);

    invalidBrowserPaths.forEach((bin) => {
      void expect(analizeWithBin(bin as never)).rejects.toThrow(TypeError);
    });

  });

  test('should read binary output filename', async () => {

    const binField = 'bin/cli.js';
    const analized = await analizeWithBin(binField);
    const { bin } = analized;

    expect(bin ? bin.output : null).toBe(binField);

  });

});
