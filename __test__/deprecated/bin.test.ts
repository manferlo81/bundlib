import { DeprecatedBinaryOption } from '../../src/api';
import { mockAnalyzeWithPkg } from '../tools/mock-fs';

describe('deprecated "bin" option', () => {

  const cwd = process.cwd();

  const analyzeWithBin = (bin: DeprecatedBinaryOption) => mockAnalyzeWithPkg(cwd, {
    bin: 'binary.js',
    bundlib: { bin },
  });

  test('Should throw on invalid "bin" option', () => {

    const invalidInputs = [
      1,
      true,
      { invalid: 100 },
    ];

    invalidInputs.forEach((bin) => {
      void expect(() => analyzeWithBin(bin as never)).rejects.toThrow(TypeError);
    });

  });

  test('Should prevent Binary module build if "bin" option is false', async () => {
    const { bin } = await analyzeWithBin(false as never);
    expect(bin).toBeNull();
  });

});
