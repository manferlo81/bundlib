import { mockAnalyzeWithPkgEmptyConfig } from '../tools/mock-fs';

describe('package.json types', () => {

  const cwd = process.cwd();

  // const mockAnalyzeWithTypesField = (field: 'types' | 'typings', value: string | undefined) => {
  //   return mockAnalyzeWithPkgEmptyConfig(cwd, { [field]: value });
  // };

  test('Should set types to null if no "types" | "typings" field present', async () => {

    const analyzed = await mockAnalyzeWithPkgEmptyConfig(cwd, {});
    const { types } = analyzed;

    expect(types).toBeNull();

  });

  test('Should read "types" field', async () => {

    const types = 'types.d.ts';
    const analyzed = await mockAnalyzeWithPkgEmptyConfig(cwd, { types });
    const { types: analyzedTypes } = analyzed;

    expect(analyzedTypes).toEqual({
      output: types,
      equals: false,
    });

  });

  test('Should read "typings" field', async () => {

    const typings = 'typings.d.ts';
    const analyzed = await mockAnalyzeWithPkgEmptyConfig(cwd, { typings });
    const { types: analyzedTypes } = analyzed;

    expect(analyzedTypes).not.toBeNull();
    expect(analyzedTypes).toEqual({
      output: typings,
      equals: false,
    });

  });

  test('Should read "types" over "typings" field', async () => {

    const typesField = 'types.d.ts';

    const analyzed = await mockAnalyzeWithPkgEmptyConfig(cwd, {
      typings: 'typings',
      types: typesField,
    });
    const { types: analyzedTypes } = analyzed;

    expect(analyzedTypes).not.toBeNull();
    expect(analyzedTypes).toEqual({
      output: typesField,
      equals: false,
    });

  });

});
