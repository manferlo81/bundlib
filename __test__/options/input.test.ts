import { colorizeMessage } from '../tools/colors';
import { mockAnalyzeWithPkg } from '../tools/mock-fs';

describe(colorizeMessage('"input" option'), () => {

  const cwd = process.cwd();

  test(colorizeMessage('Should throw on invalid "input" option'), () => {

    const invalidInputs = [
      1,
      true,
      false,
      { invalid: true },
      { api: 10, bin: 11 },
    ];

    invalidInputs.forEach((input) => {
      void expect(mockAnalyzeWithPkg(cwd, { bundlib: { input: input as never } })).rejects.toThrow('Invalid "input" option');
    });

  });

  test(colorizeMessage('Should read input option as string'), async () => {

    const input = 'src/main.ts';
    const analyzed = await mockAnalyzeWithPkg(cwd, {
      main: 'main.js',
      module: 'module.js',
      browser: 'browser.js',
      bin: 'bin.js',
      bundlib: { input },
    });

    expect(analyzed.main?.input).toBe(input);
    expect(analyzed.module?.input).toBe(input);
    expect(analyzed.browser?.input).toBe(input);
    expect(analyzed.bin?.input).toBe(input);

  });

  test(colorizeMessage('Should read api input option from object'), async () => {

    const api = 'src/main.ts';
    const analyzed = await mockAnalyzeWithPkg(cwd, {
      main: 'main.js',
      module: 'module.js',
      browser: 'browser.js',
      bundlib: {
        input: { api },
      },
    });

    expect(analyzed.main?.input).toBe(api);
    expect(analyzed.module?.input).toBe(api);
    expect(analyzed.browser?.input).toBe(api);

  });

  test(colorizeMessage('Should read binary input option from object'), async () => {

    const bin = 'src/main.ts';
    const analyzed = await mockAnalyzeWithPkg(cwd, {
      bin: 'out/bin.js',
      bundlib: {
        input: { bin },
      },
    });

    expect(analyzed.bin?.input).toBe(bin);

  });

  test(colorizeMessage('Should read binary input option over legacy bin option'), async () => {

    const bin = 'src/bin/main.ts';
    const analyzed = await mockAnalyzeWithPkg(cwd, {
      bin: 'out/bin.js',
      bundlib: {
        input: { bin },
      },
    });

    expect(analyzed.bin?.input).toBe(bin);

  });

});
