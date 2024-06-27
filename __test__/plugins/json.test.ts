import { greenBright, magentaBright } from '../../src/cli/tools/colors';
import { mockGetPluginNames } from '../tools/mock-fs';

const _pluginPkgName = magentaBright('@rollup/plugin-json');

describe(`${_pluginPkgName} plugin`, () => {

  const cwd = process.cwd();
  const pluginName = 'json';

  const outputFields = [
    { field: 'main', text: 'CommonJS Module' },
    { field: 'module', text: 'ES Module' },
    { field: 'browser', text: 'Browser build' },
    { field: 'bin', text: 'Binary build' },
  ];

  outputFields.forEach(({ field, text }) => {
    test(`Should use ${_pluginPkgName} on ${greenBright(text)}`, () => {
      const promise = mockGetPluginNames(cwd, {
        [field]: 'output.js',
      });
      return expect(promise).resolves.toContain(pluginName);
    });
  });

});
