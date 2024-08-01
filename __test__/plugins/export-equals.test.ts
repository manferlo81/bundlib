import { buildTypeColor, filenameColor, javascriptValueColor, packageFieldColor, packageNameColor } from '../tools/colors';
import { getAllPluginNames } from '../tools/get-plugin-names';
import { mockFS2, mockGetPluginNames } from '../tools/mock-fs';

const pluginPackageName = packageNameColor('rollup-plugin-export-equals');

describe(`${pluginPackageName} plugin`, () => {

  const cwd = process.cwd();
  const pluginName = 'export-equals';

  const outputFields = [
    { field: 'main', text: 'CommonJS Module' },
    { field: 'module', text: 'ES Module' },
    { field: 'browser', text: 'Browser build' },
  ];

  const bundlib = { input: { api: 'src/api/index.ts', bin: 'src/cli/index.ts' }, equals: true };

  outputFields.forEach(({ field, text }) => {
    test(`Should not use ${pluginPackageName} on ${buildTypeColor(text)} if ${packageFieldColor('"equals"')} option set to ${javascriptValueColor('false')}`, async () => {
      const plugins = await mockGetPluginNames(cwd, {
        bundlib: { ...bundlib, equals: false },
        [field]: 'output.js',
        types: 'index.d.ts',
        devDependencies: {
          typescript: '*',
        },
      });
      expect(plugins).not.toContain(pluginName);
    });
  });

  outputFields.forEach(({ field, text }) => {
    test(`Should not use ${pluginPackageName} on ${buildTypeColor(text)} if no ${filenameColor('package.json')} ${packageFieldColor('"types"')} field`, async () => {
      const plugins = await mockGetPluginNames(cwd, {
        bundlib,
        [field]: 'output.js',
        devDependencies: {
          typescript: '*',
        },
      });
      expect(plugins).not.toContain(pluginName);
    });
  });

  test(`Should use ${pluginPackageName} only on first build`, async () => {

    const [modulePlugins, mainPlugins, browserPlugins] = await mockFS2(() => {
      return getAllPluginNames(cwd, false, {
        bundlib,
        main: 'output.js',
        module: 'output.js',
        browser: 'output.js',
        types: 'index.d.ts',
        devDependencies: {
          typescript: '*',
        },
      });
    });

    expect(modulePlugins).toContain(pluginName);
    expect(mainPlugins).not.toContain(pluginName);
    expect(browserPlugins).not.toContain(pluginName);
  });

  test(`Should not use ${pluginPackageName} on ${buildTypeColor('Binary build')}`, async () => {
    const plugins = await mockGetPluginNames(cwd, {
      bundlib,
      bin: 'output.js',
      types: 'index.d.ts',
      devDependencies: {
        typescript: '*',
      },
    });
    expect(plugins).not.toContain(pluginName);
  });

});
