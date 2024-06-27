import { mockAnalyzeWithPkgEmptyConfig } from '../tools/mock-fs';

describe('package.json "bin" field', () => {

  const cwd = process.cwd();

  const mockAnalyzeWithBinField = (bin: string) => {
    return mockAnalyzeWithPkgEmptyConfig(cwd, { bin });
  };

  test('Should throw on invalid "bin" field', () => {

    const invalidBinValues = [
      1,
      { name: 'value' },
    ];

    invalidBinValues.forEach((invalid) => {
      void expect(mockAnalyzeWithBinField(invalid as never)).rejects.toThrow('Invalid package.json "bin" field');
    });

  });

  test('Should read "bin" field', async () => {

    const binField = 'binary.js';
    const analyzed = await mockAnalyzeWithBinField(binField);
    const { bin } = analyzed;

    expect(bin).not.toBeNull();
    expect(bin?.output).toBe(binField);

  });

});
