import analyze from '../tools/analyze';

describe('unknown options', () => {

  const cwd = process.cwd();

  test('should throw on unknown option', () => {

    const invalidOptions = [
      'iife',
      'amd',
      'umd',
      'option1',
      'option2',
    ];

    expect.assertions(invalidOptions.length);

    invalidOptions.forEach((option) => {
      void expect(analyze(cwd, { bundlib: { [option]: true } })).rejects.toThrow(TypeError);
    });

  });

});
