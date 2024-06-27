import { greenBright, magentaBright } from '../../src/cli/tools/colors';
import { mockGetPluginNames } from '../tools/mock-fs';

const _pluginPkgName = magentaBright('rollup-plugin-strip-shebang');

describe(`${_pluginPkgName} plugin`, () => {

  const cwd = process.cwd();
  const pluginName = 'strip-shebang';

  const outputFields = [
    { field: 'main', text: 'CommonJS Module' },
    { field: 'module', text: 'ES Module' },
    { field: 'browser', text: 'Browser build' },
  ];

  outputFields.forEach(({ field, text }) => {
    test(`Should not use ${_pluginPkgName} on ${greenBright(text)}`, () => {
      return expect(mockGetPluginNames(cwd, { [field]: 'output.js' })).resolves.not.toContain(pluginName);
    });
  });

  test(`Should use ${_pluginPkgName} on ${greenBright('Binary build')}`, () => {
    return expect(mockGetPluginNames(cwd, { bin: 'output.js' })).resolves.toContain(pluginName);
  });

});
