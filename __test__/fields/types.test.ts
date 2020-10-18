import analyze from '../tools/analyze';

describe('package.json types', () => {

  const cwd = process.cwd();

  test('should set types to null if no type path provided', async () => {

    const analyzed = await analyze(cwd, {});
    const { types } = analyzed;

    expect(types).toBeNull();

  });

  test('should read types', async () => {

    const analyzed = await analyze(cwd, {
      types: 'types/index.d.ts',
    });
    const { types } = analyzed;

    expect(types).toEqual({
      output: 'types/index.d.ts',
      equals: false,
    });

  });

  test('should read typings', async () => {

    const analyzed = await analyze(cwd, {
      typings: 'types',
    });
    const { types } = analyzed;

    expect(types).toEqual({
      output: 'types',
      equals: false,
    });

  });

  test('should read types over typings', async () => {

    const typesField = 'types';

    const analyzed = await analyze(cwd, {
      typings: 'typings',
      types: typesField,
    });
    const { types } = analyzed;

    expect(types).toEqual({
      output: typesField,
      equals: false,
    });

  });

});
