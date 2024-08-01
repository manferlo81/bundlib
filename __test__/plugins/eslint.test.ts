import { buildTypeColor, packageFieldColor, packageNameColor } from '../tools/colors';
import { mockGetPluginNames } from '../tools/mock-fs';

const eslintPackageDepName = 'eslint';

const pluginPackageName = packageNameColor('rollup-plugin-eslint');
const eslintPackageName = packageNameColor(eslintPackageDepName);

describe(`${pluginPackageName} plugin`, () => {

  const cwd = process.cwd();
  const pluginName = 'eslint';

  const deps = { eslint: '*' };
  const outputFields: Array<{ field: string; text: string }> = [
    { field: 'main', text: 'CommonJS Module' },
    { field: 'module', text: 'ES Module' },
    { field: 'browser', text: 'Browser build' },
    { field: 'bin', text: 'Binary build' },
  ];
  const dependenciesFields = ['dependencies', 'devDependencies'];

  outputFields.forEach(({ field, text }) => {
    test(`Should not use ${pluginPackageName} on ${buildTypeColor(text)} if ${eslintPackageName} not installed`, async () => {
      const plugins = await mockGetPluginNames(cwd, {
        [field]: 'output.js',
      });
      expect(plugins).not.toContain(pluginName);
    });
  });

  dependenciesFields.forEach((depField) => {
    outputFields.forEach(({ field, text }) => {
      test(`Should use ${pluginPackageName} on ${buildTypeColor(text)} if ${eslintPackageName} installed as ${packageFieldColor(`"${depField}"`)}`, async () => {
        const [plugins] = await mockGetPluginNames(cwd, {
          [field]: 'output.js',
          [depField]: deps,
        });
        expect(plugins).toContain(pluginName);
      });
    });

  });

});
