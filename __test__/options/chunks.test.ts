import { type AllowNullish, type Dictionary } from '../../src/api/types/helper-types';
import { mockAnalyzeWithPkg } from '../tools/mock-fs';

describe('"chunks" option', () => {

  const cwd = process.cwd();

  const analyzeWithChunksOption = (chunks: AllowNullish<Dictionary<string>>) => {
    return mockAnalyzeWithPkg(cwd, { bundlib: { chunks } });
  };

  test('Should throw on invalid "chunks" option', () => {

    const invalidChunksOptionValues = [
      10,
      'string',
    ];

    invalidChunksOptionValues.forEach((invalid) => {
      void expect(analyzeWithChunksOption(invalid as never)).rejects.toThrow('Invalid "chunks" option');
    });

  });

  test('Should read empty "chunks" option', async () => {

    const chunks = {};
    const { chunks: result } = await analyzeWithChunksOption(chunks);

    expect(result).toEqual(chunks);

  });

  test('Should read "chunks" option', async () => {

    const chunks = { 'src/input.ts': 'dist/output.js' };
    const { chunks: result } = await analyzeWithChunksOption(chunks);

    expect(result).toEqual(chunks);

  });

});
