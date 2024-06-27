import { greenBright, magentaBright } from '../../src/cli/tools/colors';
import { mockGetPluginNames } from '../tools/mock-fs';

const _pluginPkgName = magentaBright('@rollup/plugin-commonjs');

describe(`${_pluginPkgName} plugin`, () => {

  const cwd = process.cwd();
  const pluginName = 'commonjs';

  const outputFields = [
    { field: 'main', text: 'CommonJS Module' },
    { field: 'module', text: 'ES Module' },
    { field: 'bin', text: 'Binary build' },
  ];

  test(`Should use ${_pluginPkgName} on ${greenBright('Browser build')}`, async () => {
    const names = await mockGetPluginNames(cwd, {
      browser: 'output.js',
    });
    expect(names).toContain(pluginName);
  });

  outputFields.forEach(({ field, text }) => {
    test(`Should not use ${_pluginPkgName} on ${greenBright(text)}`, async () => {
      const plugins = await mockGetPluginNames(cwd, {
        [field]: 'output.js',
      });
      expect(plugins).not.toContain(pluginName);
    });
  });

});
