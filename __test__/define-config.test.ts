import { BundlibConfig, config, defineConfig } from '../src/api';
import { colorizeMessage } from './tools/colors';

describe(colorizeMessage('defineConfig function'), () => {

  test(colorizeMessage('Should return input config'), () => {
    const configs: BundlibConfig[] = [
      {},
      { input: 'index.ts' },
    ];
    configs.forEach((object) => {
      expect(defineConfig(object)).toBe(object);
    });
  });

  test(colorizeMessage('Should export defineConfig function as config'), () => {
    expect(config).toBe(defineConfig);
  });

});
