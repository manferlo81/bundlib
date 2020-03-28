import getPluginNames from '../tools/get-plugin-names';

describe('rollup-plugin-typescript2 plugin', () => {

  const pluginName = 'rpt2';
  const deps = { 'rollup-plugin-typescript2': '*' };
  const bundlib = { input: { api: 'src/api/index.ts', bin: 'src/cli/index.ts' } };
  const outputFields: Array<{ field: string; text: string }> = [
    { field: 'main', text: 'CommonJS Module' },
    { field: 'module', text: 'ES Module' },
    { field: 'browser', text: 'Browser build' },
    { field: 'bin', text: 'Binary build' },
  ];
  const dependenciesFields = ['dependencies', 'devDependencies'];

  outputFields.forEach(({ field, text }) => {

    test(`Should not use if not installed on ${text}`, async () => {
      const [plugins] = await getPluginNames(process.cwd(), false, {
        bundlib,
        [field]: 'output.js',
      });
      expect(plugins).not.toContain(pluginName);
    });

    test(`Should not use if not *.ts input on ${text}`, async () => {
      const [plugins] = await getPluginNames(process.cwd(), false, {
        bundlib: { input: { api: 'src/api/index.js', bin: 'src/cli/index.js' } },
        [field]: 'output.js',
      });
      expect(plugins).not.toContain(pluginName);
    });

    dependenciesFields.forEach((depField) => {
      test(`Should use if installed as "${depField}" on ${text}`, async () => {
        const [plugins] = await getPluginNames(process.cwd(), false, {
          bundlib,
          [field]: 'output.js',
          [depField]: deps,
        });
        expect(plugins).toContain(pluginName);
      });
    });

  });

});
