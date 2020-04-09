import { Plugin, PartialResolvedId } from 'rollup';
import { mapIdExternal } from '../../src/api/plugins/api-plugin';
import slash from 'slash';

describe('API Plugin', () => {

  const { resolveId } = mapIdExternal('C:/root', 'C:/root/out', {
    'src/target.ts': 'root-file.js',
    'src/helpers/index.ts': 'out/helpers.js',
  }) as Required<Plugin>;

  describe('resolveId method', () => {

    test('Should return null if no importer', async () => {

      const resolved = await resolveId.call(
        null as never,
        'C:/root/src/index.ts',
        undefined,
      ) as PartialResolvedId;

      expect(resolved).toBeNull();

    });

    test('Should return null if target not found', async () => {

      const resolved = await resolveId.call(
        null as never,
        './another-target',
        'C:/root/src/index.ts',
      ) as PartialResolvedId;

      expect(resolved).toBeNull();

    });

    test('Should resolve file from another file', async () => {

      const resolved = await resolveId.call(
        null as never,
        './target',
        'C:/root/src/index.ts',
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
        'C:/root/src/index.ts',
      ) as PartialResolvedId;
      resolved.id = slash(resolved.id);

      expect(resolved).toMatchObject({
        id: slash('./helpers.js'),
        external: true,
      });

    });

  });

});
