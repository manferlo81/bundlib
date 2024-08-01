import { filenameColor, javascriptValueColor, packageFieldColor } from '../tools/colors';
import { mockAnalyzeWithPkgEmptyConfig } from '../tools/mock-fs';

describe(`${filenameColor('package.json')} ${packageFieldColor('"main"')} field`, () => {

  const cwd = process.cwd();

  const mockAnalyzeWithMainField = (main: string) => mockAnalyzeWithPkgEmptyConfig(cwd, { main });

  test(`Should ${javascriptValueColor('throw')} on invalid ${packageFieldColor('"main"')} field`, () => {

    const invalidMainFields = [
      1,
      { name: 'value' },
    ];

    invalidMainFields.forEach((invalid) => {
      void expect(mockAnalyzeWithMainField(invalid as never)).rejects.toThrow('Invalid package.json "main" field');
    });

  });

  test(`Should read ${packageFieldColor('"main"')} field`, async () => {

    const mainField = 'main.js';
    const analyzed = await mockAnalyzeWithMainField(mainField);
    const { main } = analyzed;

    expect(main).not.toBeNull();
    expect(main?.output).toBe(mainField);

  });

});
