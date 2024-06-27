import { mockAnalyzeWithPkgEmptyConfig } from '../tools/mock-fs';

describe('package.json "peerDependencies" field', () => {

  const cwd = process.cwd();

  test('Should throw on invalid "peerDependencies" field', () => {

    const invalidFieldValues = [
      100,
      'string',
      true,
      false,
      [],
    ];

    invalidFieldValues.forEach((invalid) => {
      void expect(mockAnalyzeWithPkgEmptyConfig(cwd, { peerDependencies: invalid as never })).rejects.toThrow('Invalid package.json "peerDependencies" field');
    });

  });

  test('Should read "peerDependencies" field', async () => {

    const peerDependencies = { 'bundlib-dep': '1.2.3' };

    const analyzed = await mockAnalyzeWithPkgEmptyConfig(cwd, { peerDependencies });
    const { dependencies: { peer: peerDeps } } = analyzed;

    expect(peerDeps).toEqual(peerDependencies);

  });

});
