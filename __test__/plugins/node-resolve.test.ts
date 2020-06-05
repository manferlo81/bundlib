import { fixturePath } from '../tools/fixture-path';
import getPluginNames from '../tools/get-plugin-names';

describe('@rollup/plugin-node-resolve plugin', () => {

  const cwd = fixturePath('export-number-js');

  const pluginName = 'node-resolve';
  const outputFields: Array<{ field: string; text: string }> = [
    { field: 'main', text: 'CommonJS Module' },
    { field: 'module', text: 'ES Module' },
    { field: 'browser', text: 'Browser build' },
    { field: 'bin', text: 'Binary build' },
  ];

  outputFields.forEach(({ field, text }) => {
    test(`Should use on ${text}`, async () => {
      const [plugins] = await getPluginNames(cwd, false, {
        [field]: 'output.js',
      });
      expect(plugins).toContain(pluginName);
    });
  });

});
