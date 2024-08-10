import { colorizeMessage } from '../tools/colors';
import { mockAnalyzeWithPkg } from '../tools/mock-fs';

describe(colorizeMessage('unknown options'), () => {

  const cwd = process.cwd();

  const analyzeWithUnknownOption = (option: string) => {
    return mockAnalyzeWithPkg(
      cwd,
      { bundlib: { [option]: true } },
    );
  };

  test(colorizeMessage('Should throw on unknown option'), () => {

    const invalidOptions = [
      'iife',
      'amd',
      'umd',
      'option1',
      'option2',
    ];

    invalidOptions.forEach((option) => {
      void expect(analyzeWithUnknownOption(option)).rejects.toThrow(`Unknown options found: ("${option}")`);
    });

  });

});
