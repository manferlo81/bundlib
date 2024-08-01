import { filenameColor, javascriptValueColor, packageFieldColor } from '../tools/colors';
import { mockAnalyzeWithPkgEmptyConfig } from '../tools/mock-fs';

describe(`${filenameColor('package.json')} ${packageFieldColor('"devDependencies"')} field`, () => {

  const cwd = process.cwd();

  test(`Should ${javascriptValueColor('throw')} on invalid ${packageFieldColor('"devDependencies"')} field`, () => {

    const invalidFieldValues = [
      100,
      'string',
      true,
      false,
      [],
    ];

    invalidFieldValues.forEach((invalid) => {
      void expect(mockAnalyzeWithPkgEmptyConfig(cwd, { devDependencies: invalid as never })).rejects.toThrow('Invalid package.json "devDependencies" field');
    });

  });

  test(`Should read ${packageFieldColor('"devDependencies"')} field`, async () => {

    const devDependencies = { 'bundlib-dep': '1.2.3' };

    const analyzed = await mockAnalyzeWithPkgEmptyConfig(cwd, { devDependencies });
    const { dependencies: { dev: devDeps } } = analyzed;

    expect(devDeps).toEqual(devDependencies);

  });

});
