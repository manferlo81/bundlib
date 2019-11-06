import analize from '../tools/analize'

describe('equals option', () => {

  const cwd = process.cwd()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analizeWithEquals = (equals: any) => analize(cwd, {
    types: 'index.d.ts',
    bundlib: { equals },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analizeWithBuildEquals = (equals: any) => analize(cwd, {
    types: 'index.d.ts',
    bundlib: { equals: !equals, types: { equals } },
  })

  test('should read truthy equals option as set as boolean', async () => {

    const { output: { types } } = await analizeWithEquals(1)

    expect(types ? types.equals : null)
      .toBe(true)

  })

  test('should read falsy equals option as set as boolean', async () => {

    const { output: { types } } = await analizeWithEquals(0)

    expect(types ? types.equals : null)
      .toBe(false)

  })

  test('should read true equals option as set as boolean', async () => {

    const { output: { types } } = await analizeWithEquals(true)

    expect(types ? types.equals : null)
      .toBe(true)

  })

  test('should read false equals option as set as boolean', async () => {

    const { output: { types } } = await analizeWithEquals(false)

    expect(types ? types.equals : null)
      .toBe(false)

  })

  test('should read truthy per-build equals option as set as boolean', async () => {

    const { output: { types } } = await analizeWithBuildEquals(1)

    expect(types ? types.equals : null)
      .toBe(true)

  })

  test('should read falsy per-build equals option as set as boolean', async () => {

    const { output: { types } } = await analizeWithBuildEquals(0)

    expect(types ? types.equals : null)
      .toBe(false)

  })

  test('should read true per-build equals option as set as boolean', async () => {

    const { output: { types } } = await analizeWithBuildEquals(true)

    expect(types ? types.equals : null)
      .toBe(true)

  })

  test('should read false per-build equals option as set as boolean', async () => {

    const { output: { types } } = await analizeWithBuildEquals(false)

    expect(types ? types.equals : null)
      .toBe(false)

  })

  test('should read per-build equals option over top-level one', async () => {

    const { output: { types } } = await analize(cwd, {
      types: 'index.d.ts',
      bundlib: { equals: true, types: { equals: false } },
    })

    expect(types ? types.equals : null)
      .toBe(false)

  })

})
