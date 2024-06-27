import { mockAnalyzeWithPkgEmptyConfig } from '../tools/mock-fs';

describe('package.json "module" field', () => {

  const cwd = process.cwd();

  const mockAnalyzeWithModuleField = (module: string) => mockAnalyzeWithPkgEmptyConfig(cwd, { module });
  const mockAnalyzeWithJSNextField = (jsnext: string) => mockAnalyzeWithPkgEmptyConfig(cwd, { 'jsnext:main': jsnext });

  test('Should throw on invalid "module" field', () => {

    const invalidModuleFields = [
      1,
      { name: 'value' },
    ];

    invalidModuleFields.forEach((moduleField) => {
      void expect(mockAnalyzeWithModuleField(moduleField as never)).rejects.toThrow('Invalid package.json "module" field');
    });

  });

  test('Should throw on invalid "jsnext:main" field', () => {

    const invalidModuleFields = [
      1,
      { name: 'value' },
    ];

    expect.assertions(invalidModuleFields.length);

    invalidModuleFields.forEach((moduleField) => {
      void expect(mockAnalyzeWithJSNextField(moduleField as never)).rejects.toThrow('Invalid package.json "jsnext:main" field');
    });

  });

  test('Should read "module" field', async () => {

    const moduleField = 'out/lib.js';
    const analyzed = await mockAnalyzeWithModuleField(moduleField);
    const { module: moduleOut } = analyzed;

    expect(moduleOut ? moduleOut.output : null).toBe(moduleField);

  });

  test('Should fallback to "jsnext:main" field', async () => {

    const moduleField = 'out/lib.js';
    const analyzed = await mockAnalyzeWithJSNextField(moduleField);
    const { module: moduleOut } = analyzed;

    expect(moduleOut ? moduleOut.output : null).toBe(moduleField);

  });

  test('Should read "module" over "jsnext:main" field', async () => {

    const moduleField = 'module.js';
    const analyzed = await mockAnalyzeWithPkgEmptyConfig(cwd, {
      'jsnext:main': 'jsnext.js',
      'module': moduleField,
    });
    const { module: moduleOutput } = analyzed;

    expect(moduleOutput).not.toBeNull();
    expect(moduleOutput?.output).toMatch(moduleField);

  });

});
