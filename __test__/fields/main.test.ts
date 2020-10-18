import analyze from '../tools/analyze';

describe('package.json main field', () => {

  const cwd = process.cwd();

  const analyzeWithMain = (main: string) => analyze(cwd, { main });

  test('should throw on non string main field', () => {

    const invalidMainFields = [
      1,
      { name: 'value' },
    ];

    expect.assertions(invalidMainFields.length);

    invalidMainFields.forEach((main) => {
      void expect(analyzeWithMain(main as never)).rejects.toThrow(TypeError);

    });

  });

  test('should read main field', async () => {

    const mainField = 'out/lib.js';
    const analyzed = await analyzeWithMain(mainField);
    const { main } = analyzed;

    expect(main ? main.output : null).toBe(mainField);

  });

});
