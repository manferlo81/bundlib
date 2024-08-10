import { BundlibConfig, config } from '../src/api';
import { colorizeMessage } from './tools/colors';

describe(colorizeMessage('config function'), () => {

  test(colorizeMessage('Should return input config'), () => {
    const configs: BundlibConfig[] = [
      {},
      { input: 'index.ts' },
    ];
    configs.forEach((object) => {
      expect(config(object)).toBe(object);
    });
  });

});
