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

    const analized = await analizeWithModule('out/lib.js');
    const { module: moduleOut } = analized.output;

    expect(moduleOut ? moduleOut.path : null)
      .toMatch(/out[\\/]lib\.js$/);

  });

  test('should fallback to jsnext:main field', async () => {

    const analized = await analizeWithJSNext('out/lib.js');
    const { module: moduleOut } = analized.output;

    expect(moduleOut ? moduleOut.path : null)
      .toMatch(/out[\\/]lib\.js$/);

  });

  test('should read module field over jsnext:main', async () => {

    const analized = await analize(cwd, {
      'module': 'out.module.js',
      'jsnext:main': 'out.main.js',
    });
    const { module: moduleOut } = analized.output;

    expect(moduleOut ? moduleOut.path : null)
      .toMatch(/out\.module\.js$/);

  });

});
