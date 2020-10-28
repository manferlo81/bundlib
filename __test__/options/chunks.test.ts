import analyze from '../tools/analyze';

describe('chunks option', () => {

  test('Should throw on invalid chunks option', () => {

    const invalids = [
      10,
      'string',
    ];

    invalids.forEach((invalid) => {
      void expect(() => analyze(process.cwd(), { bundlib: { chunks: invalid as never } })).rejects.toThrow();
    });

  });

  test('Should read empty chunks option', async () => {

    const chunks = {};
    const { chunks: result } = await analyze(process.cwd(), { bundlib: { chunks } });

    expect(result).toEqual(chunks);

  });

  test('Should read chunks option', async () => {

    const chunks = { 'src/input.ts': 'dist/output.js' };
    const { chunks: result } = await analyze(process.cwd(), { bundlib: { chunks } });

    expect(result).toEqual(chunks);

  });

});
