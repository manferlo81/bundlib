import { fixturePath } from '../tools/fixture-path';
import getPluginNames from '../tools/get-plugin-names';

describe('@rollup/plugin-commonjs plugin', () => {

  const cwd = fixturePath('export-number-js');

  const pluginName = 'commonjs';
  const deps = { '@rollup/plugin-commonjs': '*' };
  const outputFields: Array<{ field: string; text: string }> = [
    { field: 'main', text: 'CommonJS Module' },
    { field: 'module', text: 'ES Module' },
    { field: 'bin', text: 'Binary build' },
  ];
  const dependenciesFields = ['dependencies', 'devDependencies'];

  test('Should not use on Browser build if not installed', async () => {
    const [plugins] = await getPluginNames(cwd, false, {
      browser: 'output.js',
    });
    expect(plugins).not.toContain(pluginName);
  });

  dependenciesFields.forEach((depField) => {
    test(`Should use on Browser build if installed as "${depField}"`, async () => {
      const [plugins] = await getPluginNames(cwd, false, {
        browser: 'output.js',
        [depField]: deps,
      });
      expect(plugins).toContain(pluginName);
    });
  });

  outputFields.forEach(({ field, text }) => {

    test(`Should not use on ${text} if not installed`, async () => {
      const [plugins] = await getPluginNames(cwd, false, {
        [field]: 'output.js',
      });
      expect(plugins).not.toContain(pluginName);
    });

    dependenciesFields.forEach((depField) => {
      test(`Should not use on ${text} if installed as "${depField}"`, async () => {
        const [plugins] = await getPluginNames(cwd, false, {
          [field]: 'output.js',
          [depField]: deps,
        });
        expect(plugins).not.toContain(pluginName);
      });
    });

  });

});
