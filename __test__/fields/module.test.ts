import analize from '../tools/analize';

describe('package.json main field', () => {

  const cwd = process.cwd();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analizeWithModule = (module: any) => analize(cwd, { module });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analizeWithJSNext = (jsnext: any) => analize(cwd, { 'jsnext:main': jsnext });

  test('should throw on non string module field', () => {

    const invalidModuleFields = [
      1,
      { name: 'value' },
    ];

    expect.assertions(invalidModuleFields.length);

    invalidModuleFields.forEach((moduleField) => {

      expect(
        analizeWithModule(moduleField),
      ).rejects
        .toThrow(TypeError);

    });

  });

  test('should throw on non string jsnext:main field', () => {

    const invalidModuleFields = [
      1,
      { name: 'value' },
    ];

    expect.assertions(invalidModuleFields.length);

    invalidModuleFields.forEach((moduleField) => {

      expect(
        analizeWithJSNext(moduleField),
      ).rejects
        .toThrow(TypeError);

    });

  });

  test('should read module field', async () => {

    const moduleField = 'out/lib.js';
    const analized = await analizeWithModule(moduleField);
    const { module: moduleOut } = analized;

    expect(moduleOut ? moduleOut.output : null).toBe(moduleField);

  });

  test('should fallback to jsnext:main field', async () => {

    const moduleField = 'out/lib.js';
    const analized = await analizeWithJSNext(moduleField);
    const { module: moduleOut } = analized;

    expect(moduleOut ? moduleOut.output : null).toBe(moduleField);

  });

  test('should read module field over jsnext:main', async () => {

    const moduleField = 'out.module.js';
    const analized = await analize(cwd, {
      'module': moduleField,
      'jsnext:main': 'out.jsnext.js',
    });
    const { module: moduleOutput } = analized;

    expect(moduleOutput ? moduleOutput.output : null).toMatch(moduleField);

  });

});
