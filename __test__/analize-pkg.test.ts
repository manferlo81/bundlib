import analize from './tools/analize';

describe('analize', () => {

  const cwd = process.cwd();

  test('should analize provided package.json', async () => {

    const pkg = { name: 'lib' };
    const analized = await analize(cwd, pkg);

    expect(analized.pkg)
      .toBe(pkg);

  });

  test('should return analized package.json', async () => {

    const pkg = { name: 'lib' };

    const analized = await analize(cwd, pkg);
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
