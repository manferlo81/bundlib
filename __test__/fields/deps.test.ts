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

  test('should throw on invalid optionalDependencies dependencies', () => {

    return expect(
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      analize(cwd, { optionalDependencies: 100 }),
    ).rejects
      .toThrow(TypeError)

  })

  test('should read runtime, peer & optional dependencies', async () => {

    const dependencies = { 'bundlib-dep1': '1.2.3' }
    const peerDependencies = { 'bundlib-dep2': '4.5.6' }
    const optionalDependencies = { 'bundlib-dep3': '7.8.9' }

    const analized = await analize(cwd, { dependencies, peerDependencies, optionalDependencies })
    const { runtime, peer, optional } = analized.dependencies

    expect(runtime).toEqual(dependencies)
    expect(peer).toEqual(peerDependencies)
    expect(optional).toEqual(optionalDependencies)

  })

})
