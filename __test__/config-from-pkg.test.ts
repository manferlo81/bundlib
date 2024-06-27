import { configsFromPkg } from '../src/api';
import { mockFS2 } from './tools/mock-fs';

describe('configsFromPkg function', () => {

  const cwd = process.cwd();

  test('Should return configs', async () => {

    const configs = await mockFS2(() => {
      return configsFromPkg(cwd, {}, {
        main: 'main.js',
        module: 'module.js',
        browser: 'browser.js',
        bin: 'binary.js',
        bundlib: { input: 'src/index.js' },
      });
    });

    expect(configs).toHaveLength(4);

  });

  test('Should return configs, no pkg passed', async () => {

    const structure = {
      'package.json': JSON.stringify({
        main: 'main.js',
        module: 'module.js',
        browser: 'browser.js',
        bin: 'binary.js',
        bundlib: { input: 'src/index.js' },
      }),
    };

    const configs = await mockFS2(() => {
      return configsFromPkg(cwd, {});
    }, structure);

    expect(configs).toHaveLength(4);

  });

  test('Should return configs, no options passed', async () => {

    const structure = {
      'package.json': JSON.stringify({
        main: 'main.js',
        module: 'module.js',
        browser: 'browser.js',
        bin: 'binary.js',
        bundlib: { input: 'src/index.js' },
      }),
    };

    const configs = await mockFS2(() => {
      return configsFromPkg(cwd);
    }, structure);

    expect(configs).toHaveLength(4);

  });

});
