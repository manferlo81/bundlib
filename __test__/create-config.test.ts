import type { Plugin } from 'rollup';
import { createConfig } from '../src/api/tools/create-config';
import { colorizeMessage, javascriptValueColor } from './tools/colors';

describe(colorizeMessage('createConfig function'), () => {

  test(colorizeMessage('Should create config'), () => {

    const input = 'src/index.js';
    const output = {
      file: 'out/lib.js',
      format: 'cjs' as const,
      sourcemap: 'inline' as const,
      esModule: true,
      interop: 'compat' as const,
    };
    const isExternal = () => false;
    const plugins: Plugin[] = [];

    const config = createConfig({
      input,
      output,
      isExternal,
      plugins,
      onwarn: null,
      useChokidar: false,
    });

    expect(config).toEqual({
      input,
      output,
      external: isExternal,
      plugins,
      watch: {
        exclude: expect.arrayContaining([
          expect.any(String),
        ]) as never,
      },
    });

  });

  test(colorizeMessage(`Should create config with ${javascriptValueColor('onwarn')}`), () => {

    const input = 'src/index.js';
    const output = {
      file: 'out/lib.js',
      format: 'cjs' as const,
      sourcemap: 'inline' as const,
      esModule: true,
      interop: 'compat' as const,
    };
    const isExternal = () => false;
    const plugins: Plugin[] = [];
    const onwarn = () => false;

    const config = createConfig({
      input,
      output,
      isExternal,
      plugins,
      onwarn,
      useChokidar: false,
    });

    expect(config).toEqual({
      input,
      output,
      external: isExternal,
      plugins,
      onwarn,
      watch: {
        exclude: expect.arrayContaining([
          expect.any(String),
        ]) as never,
      },
    });

  });

  test(colorizeMessage('Should create config with chokidar as boolean'), () => {

    const input = 'src/index.js';
    const output = {
      file: 'out/lib.js',
      format: 'cjs' as const,
      sourcemap: 'inline' as const,
      esModule: true,
      interop: 'compat' as const,
    };
    const isExternal = () => false;
    const plugins: Plugin[] = [];

    const config = createConfig({
      input,
      output,
      isExternal,
      plugins,
      onwarn: null,
      useChokidar: true,
    });

    expect(config).toEqual({
      input,
      output,
      external: isExternal,
      plugins,
      watch: {
        exclude: expect.arrayContaining([
          expect.any(String),
        ]) as never,
        chokidar: {},
      },
    });

  });

});
