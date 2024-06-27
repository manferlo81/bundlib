import { mockAnalyzeWithPkg } from '../tools/mock-fs';

describe('deprecated "types" option', () => {

  const cwd = process.cwd();

  const analyzeWithMain = (types: never) => mockAnalyzeWithPkg(cwd, {
    types: 'types.js',
    bundlib: { types },
  });

  test('Should throw on invalid "types" option', () => {

    const invalidMain = [
      1,
      true,
      { invalid: true },
      { api: 10, bin: 11 },
    ];

    invalidMain.forEach((types) => {
      void expect(analyzeWithMain(types as never)).rejects.toThrow('Invalid "types" option');
    });

  });

  test('Should prevent types generation if "types" option is false', async () => {
    const { types } = await analyzeWithMain(false as never);
    expect(types).toBeNull();
  });

});
