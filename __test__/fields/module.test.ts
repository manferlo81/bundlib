import { filenameColor, javascriptValueColor, packageFieldColor } from '../tools/colors';
import { mockAnalyzeWithPkgEmptyConfig } from '../tools/mock-fs';

describe(`${filenameColor('package.json')} ${packageFieldColor('"module"')} and ${packageFieldColor('"jsnext:main"')} fields`, () => {

  const cwd = process.cwd();

  const mockAnalyzeWithModuleField = (module: string) => mockAnalyzeWithPkgEmptyConfig(cwd, { module });
  const mockAnalyzeWithJSNextField = (jsnext: string) => mockAnalyzeWithPkgEmptyConfig(cwd, { 'jsnext:main': jsnext });

  test(`Should ${javascriptValueColor('throw')} on invalid ${packageFieldColor('"module"')} field`, () => {

    const invalidModuleFields = [
      1,
      { name: 'value' },
    ];

    invalidModuleFields.forEach((moduleField) => {
      void expect(mockAnalyzeWithModuleField(moduleField as never)).rejects.toThrow('Invalid package.json "module" field');
    });

  });

  test(`Should ${javascriptValueColor('throw')} on invalid ${packageFieldColor('"jsnext:main"')} field`, () => {

    const invalidModuleFields = [
      1,
      { name: 'value' },
    ];

    expect.assertions(invalidModuleFields.length);

    invalidModuleFields.forEach((moduleField) => {
      void expect(mockAnalyzeWithJSNextField(moduleField as never)).rejects.toThrow('Invalid package.json "jsnext:main" field');
    });

  });

  test(`Should read ${packageFieldColor('"module"')} field`, async () => {

    const moduleField = 'out/lib.js';
    const analyzed = await mockAnalyzeWithModuleField(moduleField);
    const { module: moduleOut } = analyzed;

    expect(moduleOut ? moduleOut.output : null).toBe(moduleField);

  });

  test(`Should fallback to ${packageFieldColor('"jsnext:main"')} field`, async () => {

    const moduleField = 'out/lib.js';
    const analyzed = await mockAnalyzeWithJSNextField(moduleField);
    const { module: moduleOut } = analyzed;

    expect(moduleOut ? moduleOut.output : null).toBe(moduleField);

  });

  test(`Should read ${packageFieldColor('"module"')} over ${packageFieldColor('"jsnext:main"')} field`, async () => {

    const moduleField = 'module.js';
    const analyzed = await mockAnalyzeWithPkgEmptyConfig(cwd, {
      'jsnext:main': 'jsnext.js',
      module: moduleField,
    });
    const { module: moduleOutput } = analyzed;

    expect(moduleOutput).not.toBeNull();
    expect(moduleOutput?.output).toMatch(moduleField);

  });

});
