import { createConfig } from '../src/api/create-config';
import { Plugin } from 'rollup';

describe('createConfig private method', () => {

  test('Should create config', () => {

    const input = 'src/index.js';
    const output = {
      file: 'out/lib.js',
      format: 'cjs' as 'cjs',
      sourcemap: 'inline' as 'inline',
      esModule: true,
      interop: true,
    };
    const isExternal = () => false;
    const plugins: Plugin[] = [];

    const config = createConfig(
      input,
      output,
      isExternal,
      plugins,
      null,
      false,
    );

    expect(config).toEqual({
      input,
      output,
      external: isExternal,
      plugins,
      watch: {
        exclude: expect.arrayContaining([
          expect.any(String),
        ]),
      },
    });

  });

  test('Should create config with onwarn', () => {

    const input = 'src/index.js';
    const output = {
      file: 'out/lib.js',
      format: 'cjs' as 'cjs',
      sourcemap: 'inline' as 'inline',
      esModule: true,
      interop: true,
    };
    const isExternal = () => false;
    const plugins: Plugin[] = [];
    const onwarn = () => false;

    const config = createConfig(
      input,
      output as never,
      isExternal,
      plugins,
      onwarn,
      false,
    );

    expect(config).toEqual({
      input,
      output,
      external: isExternal,
      plugins,
      onwarn,
      watch: {
        exclude: expect.arrayContaining([
          expect.any(String),
        ]),
      },
    });

  });

  test('Should create config with chokidar as boolean', () => {

    const input = 'src/index.js';
    const output = {
      file: 'out/lib.js',
      format: 'cjs' as 'cjs',
      sourcemap: 'inline' as 'inline',
      esModule: true,
      interop: true,
    };
    const isExternal = () => false;
    const plugins: Plugin[] = [];

    const config = createConfig(
      input,
      output,
      isExternal,
      plugins,
      null,
      true,
    );

    expect(config).toEqual({
      input,
      output,
      external: isExternal,
      plugins,
      watch: {
        exclude: expect.arrayContaining([
          expect.any(String),
        ]),
        chokidar: {},
      },
    });

  });

});
