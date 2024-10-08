import { colorizeMessage } from '../tools/colors';
import { mockAnalyzeWithPkgEmptyConfig } from '../tools/mock-fs';

describe(colorizeMessage('package.json "types" and "typings" fields'), () => {

  const cwd = process.cwd();

  // const mockAnalyzeWithTypesField = (field: 'types' | 'typings', value: string | undefined) => {
  //   return mockAnalyzeWithPkgEmptyConfig(cwd, { [field]: value });
  // };

  test(colorizeMessage('Should set types to null if no "types" | "typings" field present'), async () => {

    const analyzed = await mockAnalyzeWithPkgEmptyConfig(cwd, {});
    const { types } = analyzed;

    expect(types).toBeNull();

  });

  test(colorizeMessage('Should read "types" field'), async () => {

    const types = 'types.d.ts';
    const analyzed = await mockAnalyzeWithPkgEmptyConfig(cwd, { types });
    const { types: analyzedTypes } = analyzed;

    expect(analyzedTypes).toEqual({
      output: types,
      equals: false,
    });

  });

  test(colorizeMessage('Should read "typings" field'), async () => {

    const typings = 'typings.d.ts';
    const analyzed = await mockAnalyzeWithPkgEmptyConfig(cwd, { typings });
    const { types: analyzedTypes } = analyzed;

    expect(analyzedTypes).not.toBeNull();
    expect(analyzedTypes).toEqual({
      output: typings,
      equals: false,
    });

  });

  test(colorizeMessage('Should read "types" over "typings" field'), async () => {

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
