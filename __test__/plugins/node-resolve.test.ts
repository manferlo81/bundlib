import { greenBright, magentaBright } from '../../src/cli/tools/colors';
import { mockGetPluginNames } from '../tools/mock-fs';

const _pluginPkgName = magentaBright('@rollup/plugin-node-resolve');

describe(`${_pluginPkgName} plugin`, () => {

  const cwd = process.cwd();
  const pluginName = 'node-resolve';

  const outputFields = [
    { field: 'main', text: 'CommonJS Module' },
    { field: 'module', text: 'ES Module' },
    { field: 'browser', text: 'Browser build' },
    { field: 'bin', text: 'Binary build' },
  ];

  outputFields.forEach(({ field, text }) => {
    test(`Should use ${_pluginPkgName} on ${greenBright(text)}`, async () => {
      const plugins = await mockGetPluginNames(cwd, {
        [field]: 'output.js',
      });
      expect(plugins).toContain(pluginName);
    });
  });

});
