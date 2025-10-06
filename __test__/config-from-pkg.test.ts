import { configsFromPkg } from '../src/api';
import { colorizeMessage } from './tools/colors';
import { spyOnMethod } from './tools/mock';
import { mockFS } from './tools/mock-fs';

describe(colorizeMessage('configsFromPkg function'), () => {

  const cwd = process.cwd();

  test(colorizeMessage('Should return configs'), async () => {

    const configs = await mockFS(() => {
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

  test(colorizeMessage('Should return configs, no pkg passed'), async () => {
    return spyOnMethod(console, 'warn', async (consoleWarn) => {

      consoleWarn.mockImplementation();

      const structure = {
        'package.json': JSON.stringify({
          main: 'main.js',
          module: 'module.js',
          browser: 'browser.js',
          bin: 'binary.js',
          bundlib: { input: 'src/index.js' },
        }),
      };

      const configs = await mockFS(() => {
        return configsFromPkg(cwd, {});
      }, structure);

      expect(consoleWarn).toHaveBeenCalledTimes(1);
      expect(consoleWarn).toHaveBeenCalledWith(expect.stringMatching('analyzePkg should receive package.json content'));
      expect(configs).toHaveLength(4);

    });
  });

  test(colorizeMessage('Should return configs, no options passed'), async () => {
    return spyOnMethod(console, 'warn', async (consoleWarn) => {

      consoleWarn.mockImplementation();

      const structure = {
        'package.json': JSON.stringify({
          main: 'main.js',
          module: 'module.js',
          browser: 'browser.js',
          bin: 'binary.js',
          bundlib: { input: 'src/index.js' },
        }),
      };

      const configs = await mockFS(async () => {
        return configsFromPkg(cwd);
      }, structure);

      expect(consoleWarn).toHaveBeenCalledTimes(1);
      expect(consoleWarn).toHaveBeenCalledWith(expect.stringMatching('analyzePkg should receive package.json content'));
      expect(configs).toHaveLength(4);

    });
  });

  test(colorizeMessage('Should return configs, false as options passed'), async () => {
    return spyOnMethod(console, 'warn', async (consoleWarn) => {

      consoleWarn.mockImplementation();

      const structure = {
        'package.json': JSON.stringify({
          main: 'main.js',
          module: 'module.js',
          browser: 'browser.js',
          bin: 'binary.js',
          bundlib: { input: 'src/index.js' },
        }),
      };

      const configs = await mockFS(async () => {
        return configsFromPkg(cwd, false);
      }, structure);

      expect(consoleWarn).toHaveBeenCalledTimes(1);
      expect(consoleWarn).toHaveBeenCalledWith(expect.stringMatching('analyzePkg should receive package.json content'));
      expect(configs).toHaveLength(4);

    });
  });

});
