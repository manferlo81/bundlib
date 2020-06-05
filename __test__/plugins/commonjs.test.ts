import { fixturePath } from '../tools/fixture-path';
import getPluginNames from '../tools/get-plugin-names';

describe('@rollup/plugin-commonjs plugin', () => {

  const cwd = fixturePath('export-number-js');

  const pluginName = 'commonjs';
  const outputFields: Array<{ field: string; text: string }> = [
    { field: 'main', text: 'CommonJS Module' },
    { field: 'module', text: 'ES Module' },
    { field: 'bin', text: 'Binary build' },
  ];

  test('Should use on Browser build', async () => {
    const [plugins] = await getPluginNames(cwd, false, {
      browser: 'output.js',
    });
    expect(plugins).toContain(pluginName);
  });

  outputFields.forEach(({ field, text }) => {
    test(`Should not use on ${text}`, async () => {
      const [plugins] = await getPluginNames(cwd, false, {
        [field]: 'output.js',
      });
      expect(plugins).not.toContain(pluginName);
    });
  });

});
