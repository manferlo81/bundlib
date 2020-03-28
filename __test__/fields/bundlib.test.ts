import analize from '../tools/analize';

describe('package.json bundlib field', () => {

  const cwd = process.cwd();

  test('should throw on invalid bundlib field', () => {

    const invalidBundlibOptions = [
      1,
      [],
    ];

    expect.assertions(invalidBundlibOptions.length);

    invalidBundlibOptions.forEach((bundlib) => {
      expect(
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        analize(cwd, { bundlib }),
      ).rejects
        .toThrow(TypeError);
    });

  });

});
