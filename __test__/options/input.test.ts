import { mockAnalyzeWithPkg } from '../tools/mock-fs';

describe('"input" option', () => {

  const cwd = process.cwd();

  test('Should throw on invalid "input" option', () => {

    const invalidInputs = [
      1,
      true,
      false,
      { invalid: true },
      { api: 10, bin: 11 },
    ];

    invalidInputs.forEach((input) => {
      void expect(mockAnalyzeWithPkg(cwd, { bundlib: { input: input as never } })).rejects.toThrow('Invalid "input" option');
    });

  });

  test('Should read input option as string', async () => {

    const input = 'src/main.ts';
    const analyzed = await mockAnalyzeWithPkg(cwd, {
      main: 'main.js',
      module: 'module.js',
      browser: 'browser.js',
      bin: 'bin.js',
      bundlib: { input },
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(analyzed.main!.input).toBe(input);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(analyzed.module!.input).toBe(input);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(analyzed.browser!.input).toBe(input);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(analyzed.bin!.input).toBe(input);

  });

  test('Should read api input option from object', async () => {

    const api = 'src/main.ts';
    const analyzed = await mockAnalyzeWithPkg(cwd, {
      main: 'main.js',
      module: 'module.js',
      browser: 'browser.js',
      bundlib: {
        input: { api },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(analyzed.main!.input).toBe(api);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(analyzed.module!.input).toBe(api);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(analyzed.browser!.input).toBe(api);

  });

  test('Should read binary input option from object', async () => {

    const bin = 'src/main.ts';
    const analyzed = await mockAnalyzeWithPkg(cwd, {
      bin: 'out/bin.js',
      bundlib: {
        input: { bin },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(analyzed.bin!.input).toBe(bin);

  });

  test('Should read binary input option over legacy bin option', async () => {

    const bin = 'src/bin/main.ts';
    const analyzed = await mockAnalyzeWithPkg(cwd, {
      bin: 'out/bin.js',
      bundlib: {
        input: { bin },
      },
    });

    expect(analyzed.bin?.input).toBe(bin);

  });

});
