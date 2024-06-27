import { DirectoryItems } from 'mock-fs/lib/filesystem';
import { mockAnalyzeWithPkg } from './tools/mock-fs';
import { BundlibConfig } from '../src/api/types/bundlib-options';

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

  async function multiAsyncTest<I>(invalidConfigs: I[], callback: (item: I) => Promise<unknown>) {
    expect.assertions(invalidConfigs.length);
    for (const invalid of invalidConfigs) {
      await callback(invalid);
    }
  }

  test('Should throw on invalid configuration on package.json', () => {
    const invalidConfigs = [
      10,
      20,
    ];
    return multiAsyncTest(invalidConfigs, (invalid) => {
      return expect(analyzePkgWithInvalidConfig(invalid as never, {})).rejects.toThrow('Invalid package.json "bundlib" field');
    });
  });

  test('Should throw on invalid configuration file', () => {
    const invalidConfigs = [
      10,
      20,
    ];
    return multiAsyncTest(invalidConfigs, (invalid) => {
      return expect(analyzePkgWithInvalidFileConfig(invalid)).rejects.toThrow('Invalid config found on file');
    });
  });

});
