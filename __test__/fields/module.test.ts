import { colorizeMessage } from '../tools/colors';
import { expectMultiPromise } from '../tools/expect-multi';
import { mockAnalyzeWithPkgEmptyConfig } from '../tools/mock-fs';

describe(colorizeMessage('package.json "module" and "jsnext:main" fields'), () => {

  const cwd = process.cwd();

  const mockAnalyzeWithModuleField = (module: string) => mockAnalyzeWithPkgEmptyConfig(cwd, { module });
  const mockAnalyzeWithJSNextField = (jsnext: string) => mockAnalyzeWithPkgEmptyConfig(cwd, { 'jsnext:main': jsnext });

  test(colorizeMessage('Should throw on invalid "module" field'), () => {

    const invalidModuleFields = [
      1,
      { name: 'value' },
    ];

    invalidModuleFields.forEach((moduleField) => {
      void expect(mockAnalyzeWithModuleField(moduleField as never)).rejects.toThrow('Invalid package.json "module" field');
    });

  });

  test(colorizeMessage('Should throw on invalid "jsnext:main" field'), () => {

    const invalidModuleFields = [
      1,
      { name: 'value' },
    ];

    return expectMultiPromise(invalidModuleFields, (moduleField) => {
      return expect(mockAnalyzeWithJSNextField(moduleField as never)).rejects.toThrow('Invalid package.json "jsnext:main" field');
    });

  });

  test(colorizeMessage('Should read "module" field'), async () => {

    const moduleField = 'out/lib.js';
    const analyzed = await mockAnalyzeWithModuleField(moduleField);
    const { module: moduleOut } = analyzed;

    expect(moduleOut ? moduleOut.output : null).toBe(moduleField);

  });

  test(colorizeMessage('Should fallback to "jsnext:main" field'), async () => {

    const moduleField = 'out/lib.js';
    const analyzed = await mockAnalyzeWithJSNextField(moduleField);
    const { module: moduleOut } = analyzed;

    expect(moduleOut ? moduleOut.output : null).toBe(moduleField);

  });

  test(colorizeMessage('Should read "module" over "jsnext:main" field'), async () => {

    const moduleField = 'module.js';
    const analyzed = await mockAnalyzeWithPkgEmptyConfig(cwd, {
      'jsnext:main': 'jsnext.js',
      module: moduleField,
    });
    const { module: moduleOutput } = analyzed;

    expect(moduleOutput).not.toBeNull();
    expect(moduleOutput?.output).toMatch(moduleField);

  });

});
