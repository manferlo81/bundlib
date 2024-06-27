import { greenBright, magentaBright, redBright } from '../../src/cli/tools/colors';
import { mockGetPluginNames } from '../tools/mock-fs';

const typescriptPkgName = 'typescript';

const _pluginPkgName = magentaBright('rollup-plugin-typescript2');
const _typescriptPkgName = magentaBright(typescriptPkgName);

describe(`${_pluginPkgName} plugin`, () => {

  const cwd = process.cwd();

  const pluginName = 'rpt2';
  const deps = { [typescriptPkgName]: '*' };

  const outputFields: Array<{ field: string; text: string }> = [
    { field: 'main', text: 'CommonJS Module' },
    { field: 'module', text: 'ES Module' },
    { field: 'browser', text: 'Browser build' },
    { field: 'bin', text: 'Binary build' },
  ];

  const dependenciesFields = ['dependencies', 'devDependencies'];

  const bundlib = { input: { api: 'src/api/index.ts', bin: 'src/cli/index.ts' } };

  outputFields.forEach(({ field, text }) => {
    test(`Should not use ${_pluginPkgName} on ${greenBright(text)} if not installed`, async () => {
      const plugins = await mockGetPluginNames(cwd, {
        bundlib,
        [field]: 'output.js',
      });
      expect(plugins).not.toContain(pluginName);
    });
  });

  outputFields.forEach(({ field, text }) => {
    test(`Should not use ${_pluginPkgName} on ${greenBright(text)} if input is javascript file`, async () => {
      const plugins = await mockGetPluginNames(process.cwd(), {
        bundlib: { input: { api: 'src/api/index.js', bin: 'src/cli/index.js' } },
        [field]: 'output.js',
      });
      expect(plugins).not.toContain(pluginName);
    });
  });

  dependenciesFields.forEach((depField) => {
    outputFields.forEach(({ field, text }) => {
      test(`Should not use ${_pluginPkgName} on ${greenBright(text)} if ${_typescriptPkgName} installed as "${redBright(depField)}" and input is javascript file`, async () => {
        const plugins = await mockGetPluginNames(process.cwd(), {
          bundlib: { input: { api: 'src/api/index.js', bin: 'src/cli/index.js' } },
          [field]: 'output.js',
          [depField]: deps,
        });
        expect(plugins).not.toContain(pluginName);
      });
    });

    outputFields.forEach(({ field, text }) => {
      test(`Should use ${_pluginPkgName} on ${greenBright(text)} if ${_typescriptPkgName} installed as "${redBright(depField)}"`, async () => {
        const plugins = await mockGetPluginNames(process.cwd(), {
          bundlib,
          [field]: 'output.js',
          [depField]: deps,
        });
        expect(plugins).toContain(pluginName);
      });
    });

  });

});
