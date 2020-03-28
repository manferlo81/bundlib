import getPluginNames from '../tools/get-plugin-names';

describe('@rollup/plugin-commonjs plugin', () => {

  const pluginName = 'commonjs';
  const deps = { '@rollup/plugin-commonjs': '*' };
  const outputFields: Array<{ field: string; text: string }> = [
    { field: 'main', text: 'CommonJS Module' },
    { field: 'module', text: 'ES Module' },
    { field: 'bin', text: 'Binary build' },
  ];
  const dependenciesFields = ['dependencies', 'devDependencies'];

  test('Should not use if not installed on Browser build', async () => {
    const [plugins] = await getPluginNames(process.cwd(), false, {
      browser: 'output.js',
    });
    expect(plugins).not.toContain(pluginName);
  });

  dependenciesFields.forEach((depField) => {
    test(`Should use if installed as "${depField}" on Browser build`, async () => {
      const [plugins] = await getPluginNames(process.cwd(), false, {
        browser: 'output.js',
        [depField]: deps,
      });
      expect(plugins).toContain(pluginName);
    });
  });

  outputFields.forEach(({ field, text }) => {

    test(`Should not use if not installed on ${text}`, async () => {
      const [plugins] = await getPluginNames(process.cwd(), false, {
        [field]: 'output.js',
      });
      expect(plugins).not.toContain(pluginName);
    });

    dependenciesFields.forEach((depField) => {
      test(`Should not use if installed as "${depField}" on ${text}`, async () => {
        const [plugins] = await getPluginNames(process.cwd(), false, {
          [field]: 'output.js',
          [depField]: deps,
        });
        expect(plugins).not.toContain(pluginName);
      });
    });

  });

});
