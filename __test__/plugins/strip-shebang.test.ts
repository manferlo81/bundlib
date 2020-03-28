import getPluginNames from '../tools/get-plugin-names';

describe('rollup-plugin-strip-shebang plugin', () => {

  const pluginName = 'strip-shebang';
  const deps = { 'rollup-plugin-strip-shebang': '*' };
  const outputFields: Array<{ field: string; text: string }> = [
    { field: 'main', text: 'CommonJS Module' },
    { field: 'module', text: 'ES Module' },
    { field: 'browser', text: 'Browser build' },
  ];
  const dependenciesFields = ['dependencies', 'devDependencies'];

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

  dependenciesFields.forEach((depField) => {
    test(`Should use if installed as "${depField}" on Binary build`, async () => {
      const [plugins] = await getPluginNames(process.cwd(), false, {
        bin: 'output.js',
        [depField]: deps,
      });
      expect(plugins).toContain(pluginName);
    });
  });

});
