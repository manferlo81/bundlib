import { PartialResolvedId, ResolveIdHook } from 'rollup';
import slash from 'slash';
import { pluginChunks } from '../../src/api/plugins/chunks';

describe('chunks plugin', () => {

  const cwd = process.cwd();

  const { resolveId } = pluginChunks(cwd, `${cwd}/out`, ['.ts', '.js'], {
    'src/target.ts': 'root-file.js',
    'src/target-no-ext': 'root-file.js',
    'src/helpers/index.ts': 'out/helpers.js',
    'src/itself/index.ts': 'out',
  });
  const resolveIdFunction = resolveId as ResolveIdHook;

  test('Should return null if module import itself and let rollup deal with it', () => {

    expect(resolveIdFunction.call(
      null as never,
      './index',
      `${cwd}/src/itself/index.ts`,
      {} as never,
    )).toBeNull();

    expect(resolveIdFunction.call(
      null as never,
      '.',
      `${cwd}/src/itself/index.ts`,
      {} as never,
    )).toBeNull();

  });

  test('Should return null if no importer', () => {

    const resolved = resolveIdFunction.call(
      null as never,
      `${cwd}/src/index.ts`,
      undefined,
      {} as never,
    ) as PartialResolvedId;

    expect(resolved).toBeNull();

  });

  test('Should return null if target not found', () => {

    const resolved = resolveIdFunction.call(
      null as never,
      './another-target',
      `${cwd}/src/index.ts`,
      {} as never,
    ) as PartialResolvedId;

    expect(resolved).toBeNull();

  });

  test('Should resolve file from another file', () => {

    const resolved = resolveIdFunction.call(
      null as never,
      './target',
      `${cwd}/src/index.ts`,
      {} as never,
    ) as PartialResolvedId;
    resolved.id = slash(resolved.id);

    expect(resolved).toMatchObject({
      id: slash('../root-file.js'),
      external: true,
    });

  });

  test('Should resolve file from another file', () => {

    const resolved = resolveIdFunction.call(
      null as never,
      './target-no-ext',
      `${cwd}/src/index.ts`,
      {} as never,
    ) as PartialResolvedId;
    resolved.id = slash(resolved.id);

    expect(resolved).toMatchObject({
      id: slash('../root-file.js'),
      external: true,
    });

  });

  test('Should resolve file inferring index.js', () => {

    const resolved = resolveIdFunction.call(
      null as never,
      './helpers',
      `${cwd}/src/index.ts`,
      {} as never,
    ) as PartialResolvedId;
    resolved.id = slash(resolved.id);

    expect(resolved).toMatchObject({
      id: slash('./helpers.js'),
      external: true,
    });

  });

});
