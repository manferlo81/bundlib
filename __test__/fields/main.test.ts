import { mockAnalyzeWithPkgEmptyConfig } from '../tools/mock-fs';

describe('package.json "main" field', () => {

  const cwd = process.cwd();

  const mockAnalyzeWithMainField = (main: string) => mockAnalyzeWithPkgEmptyConfig(cwd, { main });

  test('Should throw on invalid "main" field', () => {

    const invalidMainFields = [
      1,
      { name: 'value' },
    ];

    invalidMainFields.forEach((invalid) => {
      void expect(mockAnalyzeWithMainField(invalid as never)).rejects.toThrow('Invalid package.json "main" field');
    });

  });

  test('Should read "main" field', async () => {

    const mainField = 'main.js';
    const analyzed = await mockAnalyzeWithMainField(mainField);
    const { main } = analyzed;

    expect(main).not.toBeNull();
    expect(main?.output).toBe(mainField);

  });

});
