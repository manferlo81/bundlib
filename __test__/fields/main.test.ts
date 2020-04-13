import analize from '../tools/analize';

describe('package.json main field', () => {

  const cwd = process.cwd();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analizeWithMain = (main: any) => analize(cwd, { main });

  test('should throw on non string main field', () => {

    const invalidMainFields = [
      1,
      { name: 'value' },
    ];

    expect.assertions(invalidMainFields.length);

    invalidMainFields.forEach((main) => {

      expect(
        analizeWithMain(main),
      ).rejects
        .toThrow(TypeError);

    });

  });

  test('should read main field', async () => {

    const mainField = 'out/lib.js';
    const analized = await analizeWithMain(mainField);
    const { main } = analized;

    expect(main ? main.path : null).toBe(mainField);

  });

});
