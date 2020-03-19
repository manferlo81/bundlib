import analize from '../tools/analize'

describe('project option', () => {

  const cwd = process.cwd()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analizeWithProject = (project: any) => analize(cwd, {
    bundlib: { project },
  })

  test('should throw on invalid project option', () => {

    const invalidProjectOptions = [
      1,
      ['string'],
      {},
      true,
    ]

    expect.assertions(invalidProjectOptions.length)

    invalidProjectOptions.forEach((invalidProject) => {
      expect(
        analizeWithProject(invalidProject),
      ).rejects
        .toThrow(TypeError)
    })

  })

  test('should read project option', async () => {

    const projectPath = 'tsconfig-2.json'

    const { project } = await analizeWithProject(projectPath)

    expect(project)
      .toBe(projectPath)

  })

  test('should be null if cache not provided', async () => {

    const { project } = await analize(cwd, {})

    expect(project)
      .toBeNull()

  })

})
