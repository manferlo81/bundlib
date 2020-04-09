import { Plugin, PartialResolvedId } from 'rollup';
import { mapIdExternal } from '../../src/api/plugins/api-plugin';
import slash from 'slash';

describe('API Plugin', () => {

  const cwd = process.cwd();

  const { resolveId } = mapIdExternal(cwd, `${cwd}/out`, {
    'src/target.ts': 'root-file.js',
    'src/helpers/index.ts': 'out/helpers.js',
  }) as Required<Plugin>;

  test('Should return null if no importer', async () => {

    const resolved = await resolveId.call(
      null as never,
      `${cwd}/src/index.ts`,
      undefined,
    ) as PartialResolvedId;

    expect(resolved).toBeNull();

  });

  test('Should return null if target not found', async () => {

    const resolved = await resolveId.call(
      null as never,
      './another-target',
      `${cwd}/src/index.ts`,
    ) as PartialResolvedId;

    expect(resolved).toBeNull();

  });

  test('Should resolve file from another file', async () => {

    const resolved = await resolveId.call(
      null as never,
      './target',
      `${cwd}/src/index.ts`,
    ) as PartialResolvedId;
    resolved.id = slash(resolved.id);

    expect(resolved).toMatchObject({
      id: slash('../root-file.js'),
      external: true,
    });

  });

  test('Should resolve file infering index.js', async () => {

    const resolved = await resolveId.call(
      null as never,
      './helpers',
      `${cwd}/src/index.ts`,
    ) as PartialResolvedId;
    resolved.id = slash(resolved.id);

    expect(resolved).toMatchObject({
      id: slash('./helpers.js'),
      external: true,
    });

  });

});
