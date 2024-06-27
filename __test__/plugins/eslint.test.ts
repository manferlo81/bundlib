import { greenBright, magentaBright, redBright } from '../../src/cli/tools/colors';
import { mockGetPluginNames } from '../tools/mock-fs';

const eslintPkgName = 'eslint';

const _pluginPkgName = magentaBright('rollup-plugin-eslint');
const _eslintPkgName = magentaBright(eslintPkgName);

describe(`${_pluginPkgName} plugin`, () => {

  const cwd = process.cwd();
  const pluginName = 'eslint';

  const deps = { 'eslint': '*' };
  const outputFields: Array<{ field: string; text: string }> = [
    { field: 'main', text: 'CommonJS Module' },
    { field: 'module', text: 'ES Module' },
    { field: 'browser', text: 'Browser build' },
    { field: 'bin', text: 'Binary build' },
  ];
  const dependenciesFields = ['dependencies', 'devDependencies'];

  outputFields.forEach(({ field, text }) => {
    test(`Should not use ${_pluginPkgName} on ${greenBright(text)} if ${_eslintPkgName} not installed`, async () => {
      const plugins = await mockGetPluginNames(cwd, {
        [field]: 'output.js',
      });
      expect(plugins).not.toContain(pluginName);
    });
  });

  dependenciesFields.forEach((depField) => {
    outputFields.forEach(({ field, text }) => {
      test(`Should use ${_pluginPkgName} on ${greenBright(text)} if ${_eslintPkgName} installed as "${redBright(depField)}"`, async () => {
        const [plugins] = await mockGetPluginNames(cwd, {
          [field]: 'output.js',
          [depField]: deps,
        });
        expect(plugins).toContain(pluginName);
      });
    });

  });

});
