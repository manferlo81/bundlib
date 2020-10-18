import analyze from './tools/analyze';

describe('analyze', () => {

  const cwd = process.cwd();

  test('should analyze provided package.json', async () => {

    const pkg = { name: 'lib' };
    const analyzed = await analyze(cwd, pkg);

    expect(analyzed.pkg)
      .toBe(pkg);

  });

  test('should return analized package.json', async () => {

    const pkg = { name: 'lib' };

    const analized = await analyze(cwd, pkg);
    const {
      main,
      module: moduleBuild,
      browser,
      bin,
      types,
      dependencies,
      cache,
    } = analized;

    expect(main).toBeNull();
    expect(moduleBuild).toBeNull();
    expect(browser).toBeNull();
    expect(bin).toBeNull();
    expect(types).toBeNull();
    expect(dependencies).toEqual({
      runtime: null,
      dev: null,
      peer: null,
    });
    expect(cache).toBeNull();

  });

});
