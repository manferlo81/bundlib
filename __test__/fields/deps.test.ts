import analyze from '../tools/analyze';

describe('package.json dependencies', () => {

  const cwd = process.cwd();

  test('should throw on invalid runtime dependencies', () => {
    return expect(analyze(cwd, { dependencies: 100 as never })).rejects.toThrow(TypeError);
  });

  test('should throw on invalid peer dependencies', () => {
    return expect(analyze(cwd, { peerDependencies: 100 as never })).rejects.toThrow(TypeError);
  });

  test('should read runtime & peer dependencies', async () => {

    const dependencies = { 'bundlib-dep1': '1.2.3' };
    const peerDependencies = { 'bundlib-dep2': '4.5.6' };

    const analyzed = await analyze(cwd, { dependencies, peerDependencies });
    const { runtime, peer } = analyzed.dependencies;

    expect(runtime).toEqual(dependencies);
    expect(peer).toEqual(peerDependencies);

  });

});
