import analyze from '../tools/analyze';

describe('package.json bin field', () => {

  const cwd = process.cwd();

  const analyzeWithBin = (bin: string) => analyze(cwd, { bin });

  test('should throw on invalid bin field', () => {

    const invalidBrowserPaths = [
      1,
      { name: 'value' },
    ];

    expect.assertions(invalidBrowserPaths.length);

    invalidBrowserPaths.forEach((bin) => {
      void expect(analyzeWithBin(bin as never)).rejects.toThrow(TypeError);
    });

  });

  test('should read binary output filename', async () => {

    const binField = 'bin/cli.js';
    const analyzed = await analyzeWithBin(binField);
    const { bin } = analyzed;

    expect(bin ? bin.output : null).toBe(binField);

  });

});
