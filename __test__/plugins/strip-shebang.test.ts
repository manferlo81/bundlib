import { buildTypeColor, packageNameColor } from '../tools/colors';
import { mockGetPluginNames } from '../tools/mock-fs';

const pluginPackageName = packageNameColor('rollup-plugin-strip-shebang');

describe(`${pluginPackageName} plugin`, () => {

  const cwd = process.cwd();
  const pluginName = 'strip-shebang';

  const outputFields = [
    { field: 'main', text: 'CommonJS Module' },
    { field: 'module', text: 'ES Module' },
    { field: 'browser', text: 'Browser build' },
  ];

  outputFields.forEach(({ field, text }) => {
    test(`Should not use ${pluginPackageName} on ${buildTypeColor(text)}`, () => {
      return expect(mockGetPluginNames(cwd, { [field]: 'output.js' })).resolves.not.toContain(pluginName);
    });
  });

  test(`Should use ${pluginPackageName} on ${buildTypeColor('Binary build')}`, () => {
    return expect(mockGetPluginNames(cwd, { bin: 'output.js' })).resolves.toContain(pluginName);
  });

});
