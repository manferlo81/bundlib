import analyze from '../tools/analyze';

describe('module option', () => {

  const cwd = process.cwd();

  const analyzeWithModule = (module: never) => analyze(cwd, {
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
      void expect(analyzeWithModule(moduleOption as never)).rejects.toThrow(TypeError);
    });

  });

  test('should prevent ES Module build if module = false', async () => {
    const { module: moduleOut } = await analyzeWithModule(false as never);
    expect(moduleOut).toBeNull();
  });

});
