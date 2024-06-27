import { SelectiveBooleanOption } from '../../src/api/types/bundlib-options';
import { PkgAnalyzed } from '../../src/api/types/pkg-analyzed';
import { mockAnalyzeWithPkg } from '../tools/mock-fs';

describe('"interop" option', () => {

  const cwd = process.cwd();

  const createResult = (analyzed: PkgAnalyzed) => {
    const { main, browser, bin } = analyzed;
    return {
      main: main?.interop,
      browser: browser?.interop,
      bin: bin?.interop,
    };
  };

  const analyzeWithBuildInterop = async (field: string, interop: SelectiveBooleanOption) => {
    return createResult(
      await mockAnalyzeWithPkg(cwd, {
        main: 'main.js',
        browser: 'browser.js',
        bin: 'binary.js',
        bundlib: { [field]: { interop } },
      }),
    );
  };

  test('Should read per-build "interop" option', () => {
    const fields = ['main', 'browser', 'bin'] as const;
    fields.forEach((field) => {
      void expect(analyzeWithBuildInterop(field, true)).resolves.toEqual({
        main: 'main' === field,
        browser: 'browser' === field,
        bin: 'bin' === field,
      });
    });
  });

  test('Should read per-build interop option over top-level one', () => {

    const getResult = async (field: string, interop: SelectiveBooleanOption) => createResult(
      await mockAnalyzeWithPkg(cwd, {
        main: 'main.js',
        browser: 'browser.js',
        bin: 'binary.js',
        bundlib: { interop: !interop, [field]: { interop } },
      }),
    );

    const fields = ['main', 'browser', 'bin'] as const;

    fields.forEach((field) => {
      [true, false].forEach((value) => {
        void expect(getResult(field, value)).resolves.toEqual({
          main: 'main' === field ? value : !value,
          browser: 'browser' === field ? value : !value,
          bin: 'bin' === field ? value : !value,
        });
      });
    });

  });

});
