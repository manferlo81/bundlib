import { buildTypeColor, packageNameColor } from '../tools/colors';
import { mockGetPluginNames } from '../tools/mock-fs';

const pluginPackageName = packageNameColor('@rollup/plugin-json');

describe(`${pluginPackageName} plugin`, () => {

  const cwd = process.cwd();
  const pluginName = 'json';

  const outputFields = [
    { field: 'main', text: 'CommonJS Module' },
    { field: 'module', text: 'ES Module' },
    { field: 'browser', text: 'Browser build' },
    { field: 'bin', text: 'Binary build' },
  ];

  outputFields.forEach(({ field, text }) => {
    test(`Should use ${pluginPackageName} on ${buildTypeColor(text)}`, () => {
      const promise = mockGetPluginNames(cwd, {
        [field]: 'output.js',
      });
      return expect(promise).resolves.toContain(pluginName);
    });
  });

});
