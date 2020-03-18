import analize from '../tools/analize'

describe('package.json dependencies', () => {

  const cwd = process.cwd()

  test('should throw on invalid runtime dependencies', () => {

    return expect(
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      analize(cwd, { dependencies: 100 }),
    ).rejects
      .toThrow(TypeError)

  })

  test('should throw on invalid peer dependencies', () => {

    return expect(
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      analize(cwd, { peerDependencies: 100 }),
    ).rejects
      .toThrow(TypeError)

  })

  test('should read runtime & peer dependencies', async () => {

    const dependencies = { 'bundlib-dep1': '1.2.3' }
    const peerDependencies = { 'bundlib-dep2': '4.5.6' }

    const analized = await analize(cwd, { dependencies, peerDependencies })
    const { runtime, peer } = analized.dependencies

    expect(runtime).toEqual(dependencies)
    expect(peer).toEqual(peerDependencies)

  })

})
