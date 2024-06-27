import { greenBright, magentaBright, redBright } from '../../src/cli/tools/colors';
import { getAllPluginNames } from '../tools/get-plugin-names';
import { mockFS2, mockGetPluginNames } from '../tools/mock-fs';

const pluginPkgName = 'rollup-plugin-export-equals';

const _pluginPkgName = magentaBright(pluginPkgName);

describe(`${_pluginPkgName} plugin`, () => {

  const cwd = process.cwd();
  const pluginName = 'export-equals';

  const outputFields = [
    { field: 'main', text: 'CommonJS Module' },
    { field: 'module', text: 'ES Module' },
    { field: 'browser', text: 'Browser build' },
  ];

  const bundlib = { input: { api: 'src/api/index.ts', bin: 'src/cli/index.ts' }, equals: true };

  outputFields.forEach(({ field, text }) => {
    test(`Should not use ${_pluginPkgName} on ${greenBright(text)} if "${redBright('equals')}" option set to ${redBright('false')}`, async () => {
      const plugins = await mockGetPluginNames(cwd, {
        bundlib: { ...bundlib, equals: false },
        [field]: 'output.js',
        types: 'index.d.ts',
      });
      expect(plugins).not.toContain(pluginName);
    });
  });

  outputFields.forEach(({ field, text }) => {
    test(`Should not use ${_pluginPkgName} on ${greenBright(text)} if no ${magentaBright('package.json')} "${redBright('types')}" field`, async () => {
      const plugins = await mockGetPluginNames(cwd, {
        bundlib,
        [field]: 'output.js',
      });
      expect(plugins).not.toContain(pluginName);
    });
  });

  test(`Should use ${_pluginPkgName} only on first build`, async () => {

    const [modulePlugins, mainPlugins, browserPlugins] = await mockFS2(() => {
      return getAllPluginNames(cwd, false, {
        bundlib,
        main: 'output.js',
        module: 'output.js',
        browser: 'output.js',
        types: 'index.d.ts',
      });
    });

    expect(modulePlugins).toContain(pluginName);
    expect(mainPlugins).not.toContain(pluginName);
    expect(browserPlugins).not.toContain(pluginName);
  });

  test(`Should not use ${_pluginPkgName} on ${greenBright('Binary build')}`, async () => {
    const plugins = await mockGetPluginNames(cwd, {
      bundlib,
      bin: 'output.js',
      types: 'index.d.ts',
    });
    expect(plugins).not.toContain(pluginName);
  });

});
