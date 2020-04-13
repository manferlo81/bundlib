import analize from '../tools/analize';

describe('module option', () => {

  const cwd = process.cwd();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analizeWithModule = (module: any) => analize(cwd, {
    module: 'out.js',
    bundlib: { module },
  });

  test('should throw on invalid module option', () => {

    const invalidModule = [
      1,
      true,
      { invalid: true },
      { api: 10, bin: 11 },
    ];

    expect.assertions(invalidModule.length);

    invalidModule.forEach((moduleOption) => {
      expect(
        analizeWithModule(moduleOption),
      ).rejects
        .toThrow(TypeError);
    });

  });

  test('should prevent ES Module build if module = false', async () => {
    const { module: moduleOut } = await analizeWithModule(false);
    expect(moduleOut).toBeNull();
  });

});
