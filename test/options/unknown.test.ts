import analize from '../tools/analize'

describe('unknown options', () => {

  const cwd = process.cwd()

  test('should throw on unknown option', () => {

    const invalidOptions = [
      'iife',
      'amd',
      'umd',
      'option1',
      'option2',
    ]

    expect.assertions(invalidOptions.length)

    invalidOptions.forEach((option) => {
      expect(
        analize(cwd, {
          bundlib: { [option]: true },
        }),
      ).rejects
        .toThrow(TypeError)
    })

  })

})
