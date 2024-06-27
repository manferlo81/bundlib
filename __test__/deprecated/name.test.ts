import { mockAnalyzeWithPkg } from '../tools/mock-fs';

describe('deprecated browser "name" option', () => {

  const cwd = process.cwd();

  test('Should read per-build name option over top-level one', async () => {

    const { browser } = await mockAnalyzeWithPkg(cwd, {
      browser: 'browser.js',
      bundlib: {
        name: 'top-level',
        browser: { name: 'library' },
      },
    });

    expect(browser ? browser.name : null).toBe('library');

  });

});
