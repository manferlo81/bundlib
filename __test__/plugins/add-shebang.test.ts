import { buildTypeColor, colorizeMessage } from '../tools/colors';
import { mockGetPluginNames } from '../tools/mock-fs';

const pluginPackageName = 'rollup-plugin-add-shebang';

describe(colorizeMessage(`${pluginPackageName} plugin`), () => {

  const cwd = process.cwd();
  const pluginName = 'shebang';

  const outputFields = [
    { field: 'main', text: 'CommonJS Module' },
    { field: 'module', text: 'ES Module' },
    { field: 'browser', text: 'Browser build' },
  ];

  outputFields.forEach(({ field, text }) => {
    test(colorizeMessage(`Should not use ${pluginPackageName} on ${buildTypeColor(text)}`), () => {
      const promise = mockGetPluginNames(cwd, { [field]: 'output.js' });
      return expect(promise).resolves.not.toContain(pluginName);
    });
  });

  test(colorizeMessage(`Should use ${pluginPackageName} on ${buildTypeColor('Binary build')}`), () => {
    const promise = mockGetPluginNames(cwd, { bin: 'output.js' });
    return expect(promise).resolves.toContain(pluginName);
  });

});
