import type { BrowserBuildFormat } from '../src/api';
import { pkgToConfigs } from '../src/api';
import { createConfigs } from './tools/create-configs';
import { mockAnalyzeWithPkg } from './tools/mock-fs';

describe('pkgToConfigs function', () => {

  const cwd = process.cwd();

  test('Should throw if try to generate types on javascript input', () => {

    const create = () => createConfigs(cwd, false, {
      main: 'lib.js',
      types: 'types/index.d.ts',
      bundlib: { input: 'src/index.js' },
    });

    return expect(create).rejects.toThrow('Can\'t generate types');

  });

  test('Should throw if types filename doesn\'t match input filename', () => {

    const create = () => createConfigs(cwd, false, {
      main: 'library.js',
      types: 'types/types.d.ts',
      bundlib: { input: 'src/index.ts' },
      devDependencies: {
        typescript: '*',
      },
    });

    return expect(create).rejects.toThrow('Input filename and types filename have to match');

  });

  test('Should throw if input is typescript but typescript not installed', () => {

    const create = () => createConfigs(cwd, false, {
      main: 'library.js',
      bundlib: { input: 'src/index.ts' },
    });

    return expect(create).rejects.toThrow('Can\'t use typescript input file if typescript is not installed');

  });

  test('Should throw if no CommonJS module input found', () => {

    const create = () => createConfigs(cwd, false, {
      main: 'library.js',
    });

    return expect(create).rejects.toThrow('Input file not found for CommonJS module');

  });

  test('Should throw if no ES module input found', () => {

    const create = () => createConfigs(cwd, false, {
      module: 'library.js',
    });

    return expect(create).rejects.toThrow('Input file not found for ES module');

  });

  test('Should throw if no Browser build input found', () => {

    const create = () => createConfigs(cwd, false, {
      browser: 'library.js',
    });

    return expect(create).rejects.toThrow('Input file not found for Browser build');

  });

  test('Should throw if no Binary build input found', () => {

    const create = () => createConfigs(cwd, false, {
      bin: 'library.js',
    });

    return expect(create).rejects.toThrow('Input file not found for Binary build');

  });

  test('Should infer browser build "name" from directory name', async () => {

    const configs = await createConfigs(cwd, false, {
      browser: 'browser.js',
      bundlib: {
        input: 'src/index.js',
      },
    });
    expect(configs).toHaveLength(1);
    const [config] = configs;
    expect(config.output.name).toBe('bundlib');
  });

  test('Should infer browser build "name" from package.json "name" field', async () => {

    const configs = await createConfigs(cwd, false, {
      name: 'pkg-name',
      browser: 'browser.js',
      bundlib: {
        input: 'src/index.js',
      },
    });
    expect(configs).toHaveLength(1);
    const [config] = configs;
    expect(config.output.name).toBe('pkgName');
  });

  test('Should throw if "name" required and not found', async () => {

    const create = async (format: BrowserBuildFormat) => {
      const analyzed = await mockAnalyzeWithPkg(cwd, {
        browser: 'browser.js',
        bundlib: { input: 'src/index.js', format },
      });
      if (analyzed.browser?.name) {
        analyzed.browser.name = null;
      }
      return pkgToConfigs(analyzed, { dev: true });
    };

    await expect(() => create('umd')).rejects.toThrow('option "name" is required for IIFE and UMD builds');
    await expect(() => create('iife')).rejects.toThrow('option "name" is required for IIFE and UMD builds');

  });

  test('Should generate empty array if no pkg content', async () => {
    const configs = await createConfigs(cwd, false, {});
    expect(configs).toHaveLength(0);
  });

  test('Should generate CommonJS module config', async () => {

    const configs = await createConfigs(cwd, false, {
      main: 'out/lib.cjs.js',
      bundlib: { input: 'src/index.js' },
    });

    expect(configs).toHaveLength(1);
    const [config] = configs;
    expect(config.output.format).toBe('cjs');

  });

  test('Should generate ES module config', async () => {

    const configs = await createConfigs(cwd, false, {
      module: 'out/lib.cjs.js',
      bundlib: { input: 'src/index.js' },
    });

    expect(configs).toHaveLength(1);
    const [config] = configs;
    expect(config.output.format).toBe('es');

  });

  test('Should generate IIFE build config', async () => {

    const format = 'iife';
    const name = 'libName';

    const configs = await createConfigs(cwd, false, {
      browser: 'browser.iife.js',
      bundlib: { input: 'src/index.js', format, name, globals: {} },
    });

    expect(configs).toHaveLength(1);
    const [config] = configs;
    const { output } = config;
    expect(output.format).toBe(format);
    expect(output.name).toBe(name);

  });

  test('Should generate AMD build config', async () => {

    const format = 'amd';
    const id = 'lib-id';

    const configs = await createConfigs(cwd, false, {
      browser: 'browser.amd.js',
      bundlib: { input: 'src/index.js', format, id, globals: {} },
    });

    expect(configs).toHaveLength(1);
    const [config] = configs;
    const { output } = config;
    expect(output.format).toBe(format);
    expect(output.amd?.id).toBe(id);

  });

  test('Should generate UMD build config', async () => {

    const format = 'umd';
    const name = 'libName';
    const id = 'lib-id';

    const configs = await createConfigs(cwd, false, {
      browser: 'out/lib.js',
      bundlib: { input: 'src/index.js', format, name, id, globals: {} },
    });

    expect(configs).toHaveLength(1);
    const [config] = configs;
    const { output } = config;
    expect(output.format).toBe(format);
    expect(output.name).toBe(name);
    expect(output.amd?.id).toBe(id);

  });

  test('Should generate UMD build as default if not format provided', async () => {

    const name = 'libName';

    const configs = await createConfigs(cwd, false, {
      browser: 'library.js',
      bundlib: { input: 'src/index.js', name },
    });

    expect(configs).toHaveLength(1);
    const [config] = configs;
    const { output } = config;
    expect(typeof output).toBe('object');
    expect(output.format).toBe('umd');
    expect(output.name).toBe(name);

  });

  test('Should generate Binary build config from typescript input', async () => {

    const configs = await createConfigs(cwd, false, {
      bin: 'binary.js',
      bundlib: { input: 'src/index.ts' },
      devDependencies: {
        typescript: '*',
      },
    });

    expect(configs).toHaveLength(1);
    const [config] = configs;
    const { output } = config;
    expect(typeof output).toBe('object');
    expect(output.format).toBe('cjs');

  });

  test('Should generate Binary build config from javascript input', async () => {

    const configs = await createConfigs(cwd, false, {
      bin: 'binary.js',
      bundlib: { input: { bin: 'src/index.js' } },
    });

    expect(configs).toHaveLength(1);
    const [config] = configs;
    const { output } = config;
    expect(typeof output).toBe('object');
    expect(output.format).toBe('cjs');

  });

  test('Should add exportEquals plugin if conditions apply', async () => {

    const configs = await createConfigs(cwd, false, {
      main: 'main.js',
      types: 'types/index.d.ts',
      bundlib: {
        input: 'src/index.ts',
        equals: true,
      },
      devDependencies: {
        'rollup-plugin-export-equals': '*',
        typescript: '*',
      },
    });

    expect(configs).toHaveLength(1);
    const [config] = configs;
    const pluginNames = config.plugins.map((plugin) => plugin.name);
    expect(pluginNames).toContain('export-equals');

  });

  test('Should add shebang plugins if conditions apply', async () => {

    const configs = await createConfigs(cwd, false, {
      bin: 'binary.js',
      bundlib: { input: 'index.js' },
      devDependencies: {
        'rollup-plugin-strip-shebang': '*',
        'rollup-plugin-add-shebang': '*',
      },
    });

    expect(configs).toHaveLength(1);
    const [config] = configs;
    const pluginNames = config.plugins.map((plugin) => plugin.name);
    expect(pluginNames).toContain('strip-shebang');
    expect(pluginNames).toContain('shebang');

  });

  test('Should generate configs with extra minified builds', async () => {

    const minifiedPostfix = '.min.js';

    const configs = await createConfigs(cwd, false, {
      main: 'main.js',
      module: 'module.js',
      browser: 'browser.js',
      bin: 'binary.js',
      bundlib: {
        input: {
          api: 'src/api/index.js',
          bin: 'src/cli/index.js',
        },
        name: 'lib',
        min: true,
      },
    });

    expect(configs).toHaveLength(8);

    configs.forEach((config, index) => {
      const isMin = index % 2;
      if (isMin) {
        const { file } = config.output;
        expect(file.substring(file.length - minifiedPostfix.length)).toBe(minifiedPostfix);
      }
    });

  });

  test('Should generate configs with extra chunks', async () => {

    const configs = await createConfigs(cwd, false, {
      main: 'main.js',
      module: 'module.js',
      browser: 'browser.js',
      bin: 'binary.js',
      bundlib: {
        input: { api: 'src/api/index.js', bin: 'src/bin/index.js' },
        name: 'lib',
        chunks: {
          'src/file.js': 'dist/file.js',
        },
      },
    });

    expect(configs).toHaveLength(5);

  });

  test('Should set dependencies as external', async () => {

    const [config] = await createConfigs(cwd, false, {
      main: 'out/lib.js',
      bundlib: { input: 'index.js' },
      dependencies: {
        lodash: '*',
      },
    });

    expect(config.external('lodash', undefined, false)).toBe(true);

  });

  test('Should set peerDependencies as external', async () => {

    const [config] = await createConfigs(cwd, false, {
      main: 'out/lib.js',
      bundlib: { input: 'index.js' },
      peerDependencies: {
        lodash: '*',
      },
    });

    expect(config.external('lodash', undefined, false)).toBe(true);

  });

  test('Should set builtin modules as external', async () => {

    const [config] = await createConfigs(cwd, false, {
      main: 'main.js',
      bundlib: { input: 'index.js' },
    });

    expect(config.external('path', undefined, false)).toBe(true);
    expect(config.external('fs', undefined, false)).toBe(true);

  });

  test('Should set partial module names as external', async () => {

    const [config] = await createConfigs(cwd, false, {
      main: 'out/lib.js',
      bundlib: { input: 'index.js' },
      dependencies: {
        lodash: '*',
      },
    });

    expect(config.external('lodash/is-array', undefined, false)).toBe(true);

  });

  test('Should set external to none if globals is null', async () => {

    const [config] = await createConfigs(cwd, false, {
      browser: 'browser.js',
      bundlib: {
        input: 'input.js',
        format: 'amd',
        globals: null,
      },
    });

    expect(config.external.toString()).toMatch(/(?:=> false)|(?:return false)/);

  });

  test('Should set globals to an object on browser build', async () => {

    const [config] = await createConfigs(cwd, false, {
      browser: 'out/lib.js',
      bundlib: {
        input: 'index.js',
        format: 'amd',
        globals: null,
      },
    });

    expect(typeof config.output.globals).toBe('object');

  });

});
