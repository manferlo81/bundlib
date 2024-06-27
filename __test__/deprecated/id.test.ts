import { mockAnalyzeWithPkg } from '../tools/mock-fs';

describe('deprecated per-build "id" option', () => {

  const cwd = process.cwd();

  test('Should read per-build id option over top-level one', async () => {

    const id = 'per-build';
    const { browser } = await mockAnalyzeWithPkg(cwd, {
      browser: 'browser.js',
      bundlib: {
        id: 'top-level',
        browser: { id },
      },
    });

    expect(browser?.id).toBe(id);

  });

});
