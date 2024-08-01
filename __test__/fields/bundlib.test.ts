import { DirectoryItems } from 'mock-fs/lib/filesystem';
import { mockAnalyzeWithPkg, mockAnalyzeWithPkgEmptyConfig } from '../tools/mock-fs';
import { filenameColor, javascriptValueColor, packageFieldColor } from '../tools/colors';

describe(`${filenameColor('package.json')} ${packageFieldColor('"bundlib"')} field`, () => {

  const cwd = process.cwd();

  test(`Should ${javascriptValueColor('throw')} on invalid ${packageFieldColor('"bundlib"')} field`, () => {

    const invalidBundlibConfig = [
      1,
      [],
    ];

    invalidBundlibConfig.forEach((invalid) => {
      void expect(mockAnalyzeWithPkgEmptyConfig(cwd, { bundlib: invalid as never })).rejects.toThrow('Invalid package.json "bundlib" field');
    });

  });

  test(`Should use ${packageFieldColor('"bundlib"')} field as config path`, async () => {

    const name = 'library';
    const configPath = 'bundlib.json';
    const config = { name };

    const structure: DirectoryItems = {
      [configPath]: JSON.stringify(config),
    };

    const analyzed = await mockAnalyzeWithPkg(
      cwd,
      { browser: 'browser.js', bundlib: configPath },
      structure,
    );

    const { browser } = analyzed;

    expect(browser).toMatchObject({ output: 'browser.js', name });

  });

  test(`Should use ${packageFieldColor('"bundlib"')} field as config`, async () => {

    const name = 'library';
    const config = { name };

    const { browser } = await mockAnalyzeWithPkgEmptyConfig(cwd, { browser: 'browser.js', bundlib: config });

    expect(browser).toMatchObject({ output: 'browser.js', name });

  });

});
