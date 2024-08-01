import { filenameColor, javascriptValueColor, packageFieldColor } from '../tools/colors';
import { mockAnalyzeWithPkgEmptyConfig } from '../tools/mock-fs';

describe(`${filenameColor('package.json')} ${packageFieldColor('"bin"')} field`, () => {

  const cwd = process.cwd();

  const mockAnalyzeWithBinField = (bin: string) => {
    return mockAnalyzeWithPkgEmptyConfig(cwd, { bin });
  };

  test(`Should ${javascriptValueColor('throw')} on invalid ${packageFieldColor('"bin"')} field`, () => {

    const invalidBinValues = [
      1,
      { name: 'value' },
    ];

    invalidBinValues.forEach((invalid) => {
      void expect(mockAnalyzeWithBinField(invalid as never)).rejects.toThrow('Invalid package.json "bin" field');
    });

  });

  test(`Should read ${packageFieldColor('"bin"')} field`, async () => {

    const binField = 'binary.js';
    const analyzed = await mockAnalyzeWithBinField(binField);
    const { bin } = analyzed;

    expect(bin).not.toBeNull();
    expect(bin?.output).toBe(binField);

  });

});
