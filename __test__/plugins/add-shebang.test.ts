import { greenBright, magentaBright } from '../../src/cli/tools/colors';
import { mockGetPluginNames } from '../tools/mock-fs';

const _pluginPkgName = magentaBright('rollup-plugin-add-shebang');

describe(`${_pluginPkgName} plugin`, () => {

  const cwd = process.cwd();
  const pluginName = 'shebang';

  const outputFields = [
    { field: 'main', text: 'CommonJS Module' },
    { field: 'module', text: 'ES Module' },
    { field: 'browser', text: 'Browser build' },
  ];

  outputFields.forEach(({ field, text }) => {
    test(`Should not use ${_pluginPkgName} on ${greenBright(text)}`, () => {
      const promise = mockGetPluginNames(cwd, { [field]: 'output.js' });
      return expect(promise).resolves.not.toContain(pluginName);
    });
  });

  test(`Should use ${_pluginPkgName} on ${greenBright('Binary build')}`, () => {
    const promise = mockGetPluginNames(cwd, { bin: 'output.js' });
    return expect(promise).resolves.toContain(pluginName);
  });

});
