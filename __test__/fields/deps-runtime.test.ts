import { filenameColor, javascriptValueColor, packageFieldColor } from '../tools/colors';
import { mockAnalyzeWithPkgEmptyConfig } from '../tools/mock-fs';

describe(`${filenameColor('package.json')} ${packageFieldColor('"dependencies"')} field`, () => {

  const cwd = process.cwd();

  test(`Should ${javascriptValueColor('throw')} on invalid ${packageFieldColor('"dependencies"')} field`, () => {

    const invalidFieldValues = [
      100,
      'string',
      true,
      false,
      [],
    ];

    invalidFieldValues.forEach((invalid) => {
      void expect(mockAnalyzeWithPkgEmptyConfig(cwd, { dependencies: invalid as never })).rejects.toThrow('Invalid package.json "dependencies" field');
    });

  });

  test(`Should read ${packageFieldColor('"dependencies"')} field`, async () => {

    const dependencies = { 'bundlib-dep': '1.2.3' };

    const analyzed = await mockAnalyzeWithPkgEmptyConfig(cwd, { dependencies });
    const { dependencies: { runtime: runtimeDeps } } = analyzed;

    expect(runtimeDeps).toEqual(dependencies);

  });

});
