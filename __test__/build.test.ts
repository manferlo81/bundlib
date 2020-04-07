import { rollup } from 'rollup';
import createConfigs from './tools/create-configs';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { dependencies, devDependencies, peerDependencies, optionalDependencies } from '../package.json';

jest.mock('rollup');

describe('build', () => {

  const cwd = process.cwd();
  const deps = { dependencies, devDependencies, peerDependencies, optionalDependencies };

  test('should build a CommonJS module', async () => {

    const [config] = await createConfigs(cwd, false, {
      main: 'out/lib.cjs.js',
      bundlib: { input: 'src/api/analize-pkg.ts' },
      ...deps,
    });
    const build = await rollup(config);
    const { output: [{ code }] } = await build.generate(config.output);

    expect(typeof code)
      .toBe('string');

  }, 30000);

  test('should build a Binary', async () => {

    const [config] = await createConfigs(cwd, false, {
      bin: 'out/lib.cjs.js',
      bundlib: {
        input: { bin: 'src/cli/index.ts' },
      },
      ...deps,
    });
    const build = await rollup(config);
    const { output: [{ code }] } = await build.generate(config.output);

    expect(typeof code)
      .toBe('string');

  }, 30000);

  test('should build a Browser module', async () => {

    const [config] = await createConfigs(cwd, false, {
      browser: 'out/lib.umd.js',
      bundlib: { input: 'src/api/helpers.ts', globals: null },
      ...deps,
    });
    const build = await rollup(config);
    const { output: [{ code }] } = await build.generate(config.output);

    expect(typeof code)
      .toBe('string');

  }, 30000);

  test('should build a CommonJS and a Binary', async () => {

    const [cjsConfig, binConfig] = await createConfigs(cwd, false, {
      main: 'out/lib.cjs.js',
      bin: 'bin/cli.js',
      bundlib: {
        input: { api: 'src/api/index.ts', bin: 'src/cli/index.ts' },
      },
      ...deps,
    });
    const cjsBuild = await rollup(cjsConfig);
    const { output: [{ code: cjsCode }] } = await cjsBuild.generate(cjsConfig.output);

    expect(typeof cjsCode)
      .toBe('string');

    const binBuild = await rollup(binConfig);
    const { output: [{ code: binCode }] } = await binBuild.generate(binConfig.output);

    expect(typeof binCode)
      .toBe('string');

  }, 30000);

});
