import { type AllowNullish } from '../../src/api/types/helper-types';
import { colorizeMessage } from '../tools/colors';
import { mockAnalyzeWithPkg } from '../tools/mock-fs';

describe(colorizeMessage('"id" option'), () => {

  const cwd = process.cwd();

  const analyzeWithIdOption = (id: AllowNullish<string>) => {
    return mockAnalyzeWithPkg(cwd, {
      browser: 'browser.js',
      bundlib: { name: 'lib', id },
    });
  };

  test(colorizeMessage('Should throw on invalid "id" option'), () => {

    const invalidIdOptions = [
      1,
      true,
      false,
    ];

    invalidIdOptions.forEach((id) => {
      void expect(analyzeWithIdOption(id as never)).rejects.toThrow('Invalid "id" option');
    });

  });

  test(colorizeMessage('Should read "id" option'), async () => {
    const id = 'libId';
    const { browser } = await analyzeWithIdOption(id);
    expect(browser?.id).toBe(id);
  });

  test(colorizeMessage('Should default to null if no "id" option present'), async () => {

    const { browser } = await mockAnalyzeWithPkg(cwd, {
      browser: 'browser.js',
      bundlib: { name: 'lib' },
    });

    expect(browser ? browser.id : false).toBeNull();

  });

});
