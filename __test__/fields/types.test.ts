import analize from '../tools/analize';

describe('package.json types', () => {

  const cwd = process.cwd();

  test('should set types to null if no type path provided', async () => {

    const analized = await analize(cwd, {});
    const { types } = analized;

    expect(types).toBeNull();

  });

  test('should read types', async () => {

    const analized = await analize(cwd, {
      types: 'types/index.d.ts',
    });
    const { types } = analized;

    expect(types).toEqual({
      output: 'types/index.d.ts',
      equals: false,
    });

  });

  test('should read typings', async () => {

    const analized = await analize(cwd, {
      typings: 'types',
    });
    const { types } = analized;

    expect(types).toEqual({
      output: 'types',
      equals: false,
    });

  });

  test('should read types over typings', async () => {

    const typesField = 'types';

    const analized = await analize(cwd, {
      typings: 'typings',
      types: typesField,
    });
    const { types } = analized;

    expect(types).toEqual({
      output: typesField,
      equals: false,
    });

  });

});
