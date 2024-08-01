import { buildTypeColor, packageFieldColor, packageNameColor } from '../tools/colors';
import { mockGetPluginNames } from '../tools/mock-fs';

const babelPackageDepName = '@babel/core';

const pluginPackageName = packageNameColor('@rollup/plugin-babel');
const babelPackageName = packageNameColor(babelPackageDepName);

describe(`${pluginPackageName} plugin`, () => {

  const cwd = process.cwd();
  const pluginName = 'babel';

  const deps = { [babelPackageDepName]: '*' };

  const outputFields = [
    { field: 'main', text: 'CommonJS Module' },
    { field: 'module', text: 'ES Module' },
    { field: 'browser', text: 'Browser build' },
    { field: 'bin', text: 'Binary build' },
  ];

  const dependenciesFields = ['dependencies', 'devDependencies'];

  outputFields.forEach(({ field, text }) => {
    test(`Should not use ${pluginPackageName} on ${buildTypeColor(text)} if ${babelPackageName} not installed`, async () => {
      const names = await mockGetPluginNames(cwd, {
        [field]: 'output.js',
        bundlib: { input: 'index.js' },
      });
      expect(names).not.toContain(pluginName);
    });
  });

  dependenciesFields.forEach((depField) => {
    outputFields.forEach(({ field, text }) => {
      test(`Should use ${pluginPackageName} on ${buildTypeColor(text)} if ${babelPackageName} installed as ${packageFieldColor(`"${depField}"`)}`, async () => {
        const names = await mockGetPluginNames(cwd, {
          [field]: 'output.js',
          [depField]: deps,
          bundlib: { input: 'index.js' },
        });
        expect(names).toContain(pluginName);
      });
    });
  });

});
