import { SelectiveStringOption } from '../../src/api/types/bundlib-options';
import { mockAnalyzeWithPkg } from '../tools/mock-fs';

describe('"project" option', () => {

  const cwd = process.cwd();

  const analyzeWithProjectOption = (project: SelectiveStringOption) => mockAnalyzeWithPkg(cwd, {
    main: 'main.js',
    module: 'module.js',
    browser: 'browser.js',
    bin: 'bin.js',
    bundlib: { project },
  });

  test('Should throw on invalid "project" option', () => {

    const invalidProjectOptions = [
      1,
      ['string'],
      true,
    ];

    invalidProjectOptions.forEach((invalidProject) => {
      void expect(analyzeWithProjectOption(invalidProject as never)).rejects.toThrow('Invalid "project" option');
    });

  });

  test('Should read "project" option', async () => {

    const projectPath = 'tsconfig-2.json';

    const { main, module: moduleOutput, browser, bin } = await analyzeWithProjectOption(projectPath);

    expect(main?.project).toBe(projectPath);
    expect(moduleOutput?.project).toBe(projectPath);
    expect(browser?.project).toBe(projectPath);
    expect(bin?.project).toBe(projectPath);

  });

  test('Should be null if "project" option not present', async () => {

    const { main, module: moduleOutput, browser, bin } = await analyzeWithProjectOption(undefined as never);

    expect(main ? main.project : 0).toBeNull();
    expect(moduleOutput ? moduleOutput.project : 0).toBeNull();
    expect(browser ? browser.project : 0).toBeNull();
    expect(bin ? bin.project : 0).toBeNull();

  });

});
