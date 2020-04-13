import { fixturePath } from '../tools/fixture-path';
import getPluginNames from '../tools/get-plugin-names';

describe('rollup-plugin-strip-shebang plugin', () => {

  const cwd = fixturePath('export-number-js');

  const pluginName = 'strip-shebang';
  const deps = { 'rollup-plugin-strip-shebang': '*' };
  const outputFields: Array<{ field: string; text: string }> = [
    { field: 'main', text: 'CommonJS Module' },
    { field: 'module', text: 'ES Module' },
    { field: 'browser', text: 'Browser build' },
  ];
  const dependenciesFields = ['dependencies', 'devDependencies'];

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

  dependenciesFields.forEach((depField) => {
    test(`Should use on Binary build if installed as "${depField}"`, async () => {
      const [plugins] = await getPluginNames(cwd, false, {
        bin: 'output.js',
        [depField]: deps,
      });
      expect(plugins).toContain(pluginName);
    });
  });

});
