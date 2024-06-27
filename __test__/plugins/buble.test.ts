import { greenBright, magentaBright, redBright } from '../../src/cli/tools/colors';
import { mockGetPluginNames } from '../tools/mock-fs';

const babelPkgName = '@babel/core';

const _pluginPkgName = magentaBright('@rollup/plugin-buble');
const _babelPkgName = magentaBright(babelPkgName);

describe(`${_pluginPkgName} plugin`, () => {

  const cwd = process.cwd();
  const pluginName = 'buble';

  const deps = { [babelPkgName]: '*' };

  const outputFields = [
    { field: 'main', text: 'CommonJS Module' },
    { field: 'module', text: 'ES Module' },
    { field: 'browser', text: 'Browser build' },
    { field: 'bin', text: 'Binary build' },
  ];

  const dependenciesFields = ['dependencies', 'devDependencies'];

  outputFields.forEach(({ field, text }) => {
    test(`Should use ${_pluginPkgName} on ${greenBright(text)} if ${_babelPkgName} not installed`, async () => {
      const names = await mockGetPluginNames(cwd, {
        [field]: 'output.js',
      });
      expect(names).toContain(pluginName);
    });
  });

  dependenciesFields.forEach((depField) => {
    outputFields.forEach(({ field, text }) => {
      test(`Should not use ${_pluginPkgName} on ${greenBright(text)} if ${_babelPkgName} installed as "${redBright(depField)}"`, async () => {
        const names = await mockGetPluginNames(cwd, {
          [field]: 'output.js',
          [depField]: deps,
        });
        expect(names).not.toContain(pluginName);
      });
    });

  });

});
