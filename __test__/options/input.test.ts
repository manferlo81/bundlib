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

    const analized = await analize(cwd, {
      bundlib: { input: 'src/main.ts' },
    });

    expect(analized.input.api)
      .toMatch(/src[/\\]main\.ts$/);

  });

  test('should read api input option from object', async () => {

    const analized = await analize(cwd, {
      bundlib: {
        input: { api: 'src/main.ts' },
      },
    });

    expect(analized.input.api)
      .toMatch(/src[/\\]main\.ts$/);

  });

  test('should read binary input option from object', async () => {

    const analized = await analize(cwd, {
      bundlib: {
        input: { bin: 'src/main.ts' },
      },
    });

    expect(analized.input.bin)
      .toMatch(/src[/\\]main\.ts$/);

  });

  test('should read binary input option over legacy bin option', async () => {

    const analized = await analize(cwd, {
      bundlib: {
        input: { bin: 'src/bin/main.ts' },
      },
    });

    expect(analized.input.bin)
      .toMatch(/src[/\\]bin[/\\]main\.ts$/);

  });

});
