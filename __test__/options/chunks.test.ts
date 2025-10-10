import type { BundlibConfig } from '../../src/api'
import { colorizeMessage } from '../tools/colors'
import { mockAnalyzeWithPkg } from '../tools/mock-fs'

describe(colorizeMessage('"chunks" option'), () => {

  const cwd = process.cwd()

  const analyzeWithChunksOption = (chunks: BundlibConfig['chunks']) => {
    return mockAnalyzeWithPkg(cwd, { bundlib: { chunks } })
  }

  test(colorizeMessage('Should throw on invalid "chunks" option'), () => {

    const invalidChunksOptionValues = [
      10,
      'string',
    ]

    invalidChunksOptionValues.forEach((invalid) => {
      void expect(analyzeWithChunksOption(invalid as never)).rejects.toThrow('Invalid "chunks" option')
    })

  })

  test(colorizeMessage('Should read empty "chunks" option'), async () => {

    const chunks = {}
    const { chunks: result } = await analyzeWithChunksOption(chunks)

    expect(result).toEqual(chunks)

  })

  test(colorizeMessage('Should read "chunks" option'), async () => {

    const chunks = { 'src/input.ts': 'dist/output.js' }
    const { chunks: result } = await analyzeWithChunksOption(chunks)

    expect(result).toEqual(chunks)

  })

})
