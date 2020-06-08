import analize from '../tools/analize';

describe('project option', () => {

  const cwd = process.cwd();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analizeWithProject = (project: string) => analize(cwd, {
    main: 'main.js',
    module: 'module.js',
    browser: 'browser.js',
    bin: 'bin.js',
    bundlib: { project },
  });

  test('should throw on invalid project option', () => {

    const invalidProjectOptions = [
      1,
      ['string'],
      true,
    ];

    expect.assertions(invalidProjectOptions.length);

    invalidProjectOptions.forEach((invalidProject) => {
      void expect(analizeWithProject(invalidProject as never)).rejects.toThrow(TypeError);
    });

  });

  test('should read project option', async () => {

    const projectPath = 'tsconfig-2.json';

    const { main, module: moduleOutput, browser, bin } = await analizeWithProject(projectPath);

    expect(main ? main.project : null).toBe(projectPath);
    expect(moduleOutput ? moduleOutput.project : null).toBe(projectPath);
    expect(browser ? browser.project : null).toBe(projectPath);
    expect(bin ? bin.project : null).toBe(projectPath);

  });

  test('should be null if project not provided', async () => {

    const { main, module: moduleOutput, browser, bin } = await analizeWithProject(undefined as never);

    expect(main ? main.project : 0).toBeNull();
    expect(moduleOutput ? moduleOutput.project : 0).toBeNull();
    expect(browser ? browser.project : 0).toBeNull();
    expect(bin ? bin.project : 0).toBeNull();

  });

});
