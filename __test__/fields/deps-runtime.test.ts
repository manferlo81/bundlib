import { colorizeMessage } from '../tools/colors';
import { mockAnalyzeWithPkgEmptyConfig } from '../tools/mock-fs';

describe(colorizeMessage('package.json "dependencies" field'), () => {

  const cwd = process.cwd();

  test(colorizeMessage('Should throw on invalid "dependencies" field'), () => {

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

  test(colorizeMessage('Should read "dependencies" field'), async () => {

    const dependencies = { 'bundlib-dep': '1.2.3' };

    const analyzed = await mockAnalyzeWithPkgEmptyConfig(cwd, { dependencies });
    const { dependencies: { runtime: runtimeDeps } } = analyzed;

    expect(runtimeDeps).toEqual(dependencies);

  });

});
