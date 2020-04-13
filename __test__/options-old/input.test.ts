import analize from '../tools/analize';

describe('input option', () => {

  const cwd = process.cwd();

  test('should throw on invalid input option', () => {

    const invalidInputs = [
      1,
      true,
      false,
      { invalid: true },
      { api: 10, bin: 11 },
    ];

    expect.assertions(invalidInputs.length);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    invalidInputs.forEach((input: any) => {
      expect(
        analize(cwd, {
          bundlib: { input },
        }),
      ).rejects
        .toThrow(TypeError);
    });

  });

  test('should read input option as string', async () => {

    const input = 'src/main.ts';
    const analized = await analize(cwd, {
      main: 'main.js',
      module: 'module.js',
      browser: 'browser.js',
      bin: 'bin.js',
      bundlib: { input },
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(analized.main!.input).toBe(input);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(analized.module!.input).toBe(input);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(analized.browser!.input).toBe(input);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(analized.bin!.input).toBe(input);

  });

  test('should read api input option from object', async () => {

    const api = 'src/main.ts';
    const analized = await analize(cwd, {
      main: 'main.js',
      module: 'module.js',
      browser: 'browser.js',
      bundlib: {
        input: { api },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(analized.main!.input).toBe(api);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(analized.module!.input).toBe(api);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(analized.browser!.input).toBe(api);

  });

  test('should read binary input option from object', async () => {

    const bin = 'src/main.ts';
    const analized = await analize(cwd, {
      bin: 'out/bin.js',
      bundlib: {
        input: { bin },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(analized.bin!.input).toBe(bin);

  });

  test('should read binary input option over legacy bin option', async () => {

    const bin = 'src/bin/main.ts';
    const analized = await analize(cwd, {
      bin: 'out/bin.js',
      bundlib: {
        input: { bin },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(analized.bin!.input).toBe(bin);

  });

});
