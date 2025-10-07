import { join as joinPath } from 'node:path'
import { normalizeExpectedTypesFilename } from '../../src/api/tools/normalize-types-filename'

describe('normalizeExpectedTypesFilename function', () => {

  test('Should return normalized file name from file path', () => {
    const cwd = process.cwd()
    const paths = [
      'types/index.d.ts',
      'types/types.d.ts',
      './types/index.d.ts',
      './types/types.d.ts',
    ]
    paths.forEach((typesPath) => {
      const expected = joinPath(cwd, typesPath)
      expect(normalizeExpectedTypesFilename(cwd, typesPath)).toBe(expected)
    })
  })

  test('Should return normalized file name from directory path', () => {
    const cwd = process.cwd()
    const paths = [
      'types',
      './types',
    ]
    paths.forEach((typesPath) => {
      const expected = joinPath(cwd, typesPath, 'index.d.ts')
      expect(normalizeExpectedTypesFilename(cwd, typesPath)).toBe(expected)
    })
  })

})
