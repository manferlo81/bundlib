import type { DirectoryItems } from 'mock-fs/lib/filesystem';
import type { BundlibConfig } from '../src/api/types/bundlib-options';
import { colorizeMessage, filenameColor } from './tools/colors';
import { expectMultiPromise } from './tools/expect-multi';
import { mockAnalyzeWithPkg } from './tools/mock-fs';

describe('Invalid configuration file', () => {

  const cwd = process.cwd();

  function analyzePkgWithInvalidConfig(invalid: BundlibConfig | string, structure: DirectoryItems) {
    return mockAnalyzeWithPkg(
      cwd,
      { bundlib: invalid },
      structure,
    );
  }

  const analyzePkgWithInvalidFileConfig = (invalid: unknown) => {
    const structure = {
      'config.json': JSON.stringify(invalid),
    };
    return analyzePkgWithInvalidConfig('config.json', structure);
  };

  test(colorizeMessage(`Should throw on invalid configuration on ${filenameColor('package.json')}`), () => {
    const invalidConfigs = [
      10,
      20,
    ];
    return expectMultiPromise(invalidConfigs, (invalid) => {
      return expect(analyzePkgWithInvalidConfig(invalid as never, {})).rejects.toThrow('Invalid package.json "bundlib" field');
    });
  });

  test(colorizeMessage('Should throw on invalid configuration file'), () => {
    const invalidConfigs = [
      10,
      20,
    ];
    return expectMultiPromise(invalidConfigs, (invalid) => {
      return expect(analyzePkgWithInvalidFileConfig(invalid)).rejects.toThrow('Invalid config found on file');
    });
  });

});
