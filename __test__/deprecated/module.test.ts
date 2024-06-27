import { DeprecatedModuleOption } from '../../src/api/types/deprecated-options';
import { mockAnalyzeWithPkg } from '../tools/mock-fs';

describe('deprecated "module" option', () => {

  const cwd = process.cwd();

  const analyzeWithDeprecatedMain = (module: DeprecatedModuleOption) => mockAnalyzeWithPkg(cwd, {
    module: 'module.js',
    bundlib: { module },
  });

  test('Should throw on invalid "module" option', () => {

    const invalidMain = [
      1,
      true,
      { invalid: true },
      { api: 10, bin: 11 },
    ];

    invalidMain.forEach((main) => {
      void expect(() => analyzeWithDeprecatedMain(main as never)).rejects.toThrow('Invalid "module" option');
    });

  });

  test('Should prevent ES module  build if "module" options is false', async () => {
    const { module } = await analyzeWithDeprecatedMain(false);
    expect(module).toBeNull();
  });

});
