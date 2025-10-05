import { resolve } from 'path';
import type { RenderChunkHook, TransformHook } from 'rollup';
import { createConfigs } from '../tools/create-configs';

describe('shebang plugins', () => {

  const cwd = process.cwd();

  test('Should capture shebang', async () => {

    const configs = await createConfigs(cwd, false, {
      bin: 'binary.js',
      bundlib: { input: 'index.js', sourcemap: false },
    });
    const [config] = configs;

    const stripPlugin = config.plugins.find(({ name }) => name === 'strip-shebang');
    const addPlugin = config.plugins.find(({ name }) => name === 'shebang');

    const transform = stripPlugin?.transform;
    expect(transform).toBeInstanceOf(Function);

    const shebang = '#!/usr/bin/env node;';
    const code = 'export default 100';

    const transformed = (transform as TransformHook).call(null as never, `${shebang}\r\n${code}`, 'index.js');
    expect(transformed).not.toMatch(shebang);
    expect(transformed).toMatch(code);

    const renderChunk = addPlugin?.renderChunk;
    expect(renderChunk).toBeInstanceOf(Function);

    const output = (renderChunk as RenderChunkHook).call(
      null as never,
      transformed as string,
      { fileName: 'binary.js' } as never,
      { dir: cwd, file: resolve(cwd, 'binary.js'), sourcemap: false } as never,
      {} as never,
    );
    expect(output).toMatch(shebang);
    expect(output).toMatch(code);

  });

});
