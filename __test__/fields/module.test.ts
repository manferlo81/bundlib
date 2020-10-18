import analyze from '../tools/analyze';

describe('package.json main field', () => {

  const cwd = process.cwd();

  const analyzeWithModule = (module: string) => analyze(cwd, { module });
  const analyzeWithJSNext = (jsnext: string) => analyze(cwd, { 'jsnext:main': jsnext });

  test('should throw on non string module field', () => {

    const invalidModuleFields = [
      1,
      { name: 'value' },
    ];

    expect.assertions(invalidModuleFields.length);

    invalidModuleFields.forEach((moduleField) => {
      void expect(analyzeWithModule(moduleField as never)).rejects.toThrow(TypeError);
    });

  });

  test('should throw on non string jsnext:main field', () => {

    const invalidModuleFields = [
      1,
      { name: 'value' },
    ];

    expect.assertions(invalidModuleFields.length);

    invalidModuleFields.forEach((moduleField) => {
      void expect(analyzeWithJSNext(moduleField as never)).rejects.toThrow(TypeError);
    });

  });

  test('should read module field', async () => {

    const moduleField = 'out/lib.js';
    const analyzed = await analyzeWithModule(moduleField);
    const { module: moduleOut } = analyzed;

    expect(moduleOut ? moduleOut.output : null).toBe(moduleField);

  });

  test('should fallback to jsnext:main field', async () => {

    const moduleField = 'out/lib.js';
    const analyzed = await analyzeWithJSNext(moduleField);
    const { module: moduleOut } = analyzed;

    expect(moduleOut ? moduleOut.output : null).toBe(moduleField);

  });

  test('should read module field over jsnext:main', async () => {

    const moduleField = 'out.module.js';
    const analyzed = await analyze(cwd, {
      'module': moduleField,
      'jsnext:main': 'out.jsnext.js',
    });
    const { module: moduleOutput } = analyzed;

    expect(moduleOutput ? moduleOutput.output : null).toMatch(moduleField);

  });

});
