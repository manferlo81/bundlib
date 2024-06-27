import { DeprecatedMainOption } from '../../src/api/types/deprecated-options';
import { mockAnalyzeWithPkg } from '../tools/mock-fs';

describe('deprecated "main" option', () => {

  const cwd = process.cwd();

  const analyzeWithDeprecatedMain = (main: DeprecatedMainOption) => mockAnalyzeWithPkg(cwd, {
    main: 'main.js',
    bundlib: { main },
  });

  test('Should throw on invalid "main" option', () => {

    const invalidMain = [
      1,
      true,
      { invalid: true },
      { api: 10, bin: 11 },
    ];

    invalidMain.forEach((main) => {
      void expect(() => analyzeWithDeprecatedMain(main as never)).rejects.toThrow('Invalid "main" option');
    });

  });

  test('Should prevent CommonJS module build if "main" options is false', async () => {
    const { main } = await analyzeWithDeprecatedMain(false);
    expect(main).toBeNull();
  });

});
